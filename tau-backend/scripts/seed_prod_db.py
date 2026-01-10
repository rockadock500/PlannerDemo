import requests
import time

API_URL = "https://tau-crm-production.up.railway.app/api"

initial_contacts = [
    {"name": "Alice Johnson", "email": "alice@condenast.com", "company": "Conde Nast", "role": "Director", "value": 50000},
    {"name": "Bob Smith", "email": "bob@awaze.com", "company": "Awaze", "role": "VP Sales", "value": 75000},
    {"name": "Charlie Brown", "email": "charlie@shell.com", "company": "Shell", "role": "Manager", "value": 120000},
]

initial_users = [
    {"name": "Rob", "email": "rob@tau.ai", "role": "Sales"},
    {"name": "James", "email": "james@tau.ai", "role": "Sales"},
    {"name": "Jill", "email": "jill@tau.ai", "role": "Manager"},
]

def seed():
    print(f"Targeting API: {API_URL}")
    
    # 1. Create Contacts & Opportunities
    for c in initial_contacts:
        contact_payload = {
            "name": c['name'],
            "email": c['email'],
            "company": c['company'],
            "role": c['role']
        }
        try:
            # Create Contact
            res = requests.post(f"{API_URL}/contacts", json=contact_payload)
            if res.status_code in [200, 201]:
                contact_data = res.json()
                print(f"Created Contact: {contact_data['name']}")
                
                # Create Opportunity
                opp_payload = {
                    "title": f"{c['company']} - Initial Deal",
                    "value": c['value'],
                    "stage": "Initial",
                    "owner_id": 1, 
                    "contact_id": contact_data['id']
                }
                res_opp = requests.post(f"{API_URL}/opportunities", json=opp_payload)
                if res_opp.status_code in [200, 201]:
                    print(f"  -> Created Opportunity: {c['company']}")
                else:
                    print(f"  -> Failed Opp ({res_opp.status_code}): {res_opp.text}")
            else:
                print(f"Failed Contact {c['name']} ({res.status_code}): {res.text}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    print("Waiting 30s for deployment to stabilize...")
    time.sleep(5) # fast wait for now, user can run it manually
    seed()
