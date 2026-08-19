import requests
import sys

BASE_URL = "http://localhost:8000/api"

def test_api():
    print("Testing API Endpoints...")
    
    # 1. Get Users
    try:
        r = requests.get(f"{BASE_URL}/users")
        r.raise_for_status()
        users = r.json()
        print(f"✅ GET /users: Found {len(users)} users")
        if not users:
            print("   WARNING: No users found. Frontend dropdown will be empty.")
    except Exception as e:
        print(f"❌ GET /users FAILED: {e}")

    # 2. Create Contact
    contact_id = None
    try:
        new_contact = {
            "name": "Test User Automata",
            "email": "test.automata@example.com",
            "company": "Automata Inc",
            "is_primary": True
        }
        # Check if exists first to avoid 400
        # Actually our API returns 400 if exists.
        # Let's delete it if we could? No delete endpoint yet.
        # We'll use a random email
        import time
        new_contact["email"] = f"test_{int(time.time())}@example.com"
        
        r = requests.post(f"{BASE_URL}/contacts", json=new_contact)
        if r.status_code == 400:
             print("   Contact already exists (expected if re-running)")
        else:
             r.raise_for_status()
             data = r.json()
             contact_id = data['id']
             print(f"✅ POST /contacts: Created contact ID {contact_id}")
    except Exception as e:
         print(f"❌ POST /contacts FAILED: {e}")
         print(r.text)

    # 3. Create Opportunity linked to Contact
    if contact_id:
        try:
            new_opp = {
                "name": "Automata Big Deal",
                "value": 50000,
                "stage": "Initial",
                "contact_id": contact_id,
                "owner_id": users[0]['id'] if users else None
            }
            r = requests.post(f"{BASE_URL}/opportunities", json=new_opp)
            r.raise_for_status()
            opp_data = r.json()
            print(f"✅ POST /opportunities: Created Deal ID {opp_data['id']}")
            
            # Verify Owner Link
            if new_opp["owner_id"] and opp_data.get("owner_id") == new_opp["owner_id"]:
                 print("   Owner Linked Correctly.")
            else:
                 print(f"   ⚠️ Owner Link Mismatch: Sent {new_opp['owner_id']}, Got {opp_data.get('owner_id')}")

        except Exception as e:
            print(f"❌ POST /opportunities FAILED: {e}")
            print(r.text)

if __name__ == "__main__":
    test_api()
