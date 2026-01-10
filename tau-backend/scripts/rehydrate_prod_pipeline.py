import requests
import json

API_URL = "https://tau-crm-production.up.railway.app/api"

PIPELINE_DATA = [
    ("The 7Stars", "Media Planner (Digital)", 100, "Andy"),
    ("The 7Stars", "Gravity Planner", 100, "Andy"),
    ("The 7Stars", "Paid Media", 100, "Andy"),
    ("Intermedia", "Discovery > Paid Media", 100, "Ruarri"),
    ("PPL", "Discovery > Media Planner", 100, "David"),
    ("Midnite", "CRM", 100, "David"),
    ("SMG", "Automation", 100, "David"),
    ("Proofpoint", "Custom GPTs", 100, "Jill"),
    ("Sainsburys", "Chatbot", 100, "Jill"),
    ("Zepz", "Data Consultancy", 100, "Rob"),
    ("Tombola", "Data Consultancy", 100, "Rob"),
    ("RGE", "Automation", 100, "Jill"),
    ("MIQ", "Media Planner", 100, "Zuzanna"),
    ("Howden", "Data Consultancy > Automation", 100, "Rob"),
    ("Bountiful Cow", "Automation", 80, "David"),
    ("Midnite", "Paid Media", 80, "David"),
    ("Midnite", "Affiliate", 80, "David"),
    ("Sainsburys", "SKU Project (Scoping)", 80, "Jill"),
    ("Sainsburys", "Insights Generator (Scoping)", 80, "Jill"),
    ("Expedia", "Automation", 80, "Jill"),
    ("Proofpoint", "Data Consultancy", 80, "Ruarri"),
    ("Rover", "Paid Media", 80, "Andy"),
    ("Legend", "Automation", 80, "David"),
    ("Holley", "Paid Media", 80, "Andy"),
    ("MediaMath", "Media Planner", 80, "Rob"),
    ("Amplifyd", "Paid Media", 80, "Rob"),
    ("William Grant & Sons", "Discovery > Media Planner", 80, "Rob"),
    ("Goodstuff", "Workshop", 40, "Rob"),
    ("Experian", "Data Consultancy > Media Optimiser", 80, "Andy"),
    ("Sainsburys", "Training - Vibe-coding part 2", 80, "Jill")
]

def get_stage(confirmed_pct):
    if confirmed_pct == 100:
        return "Signed"
    elif confirmed_pct >= 80:
        return "Verbal"
    else:
        return "Proposal"

def rehydrate():
    print(f"Hydrating Pipeline to: {API_URL}")

    # 1. Ensure Users Exist & Build Map
    needed_users = set(item[3] for item in PIPELINE_DATA)
    user_map = {} # Name -> ID

    # Fetch existing
    try:
        existing_users = requests.get(f"{API_URL}/users").json()
        for u in existing_users:
            user_map[u['name']] = u['id']
    except Exception as e:
        print(f"Failed to fetch users: {e}")
        return

    # Create missing
    for name in needed_users:
        if name not in user_map:
            print(f"Creating User: {name}")
            try:
                res = requests.post(f"{API_URL}/users", json={"name": name, "role": "Sales"})
                if res.status_code in [200, 201]:
                    user_map[name] = res.json()['id']
                else:
                    print(f"Failed to create user {name}: {res.text}")
            except Exception as e:
                print(f"Error creating user {name}: {e}")
    
    # 2. Process Deals
    for client_name, workstream, confirmed, owner_name in PIPELINE_DATA:
        # A. Find/Create Contact
        contact_id = None
        # Try to match by "Placeholder ({client_name})"
        target_name = f"Placeholder ({client_name})"
        target_email = f"placeholder@{client_name.replace(' ', '').lower()}.com"

        # Search existing contacts (Inefficient linear search given API constraints, but fine for 30 items)
        # We also need to be careful not to spam duplicates.
        # Ideally we'd have a search API, but we'll try create and handle 400 or just blindly create if email key collisions handle it.
        
        contact_payload = {
            "name": target_name,
            "email": target_email,
            "company": client_name,
            "is_primary": True
        }

        try:
            res = requests.post(f"{API_URL}/contacts", json=contact_payload)
            if res.status_code in [200, 201]:
                contact_id = res.json()['id']
            elif res.status_code == 400:
                # Exists. Find it.
                # Optimization: Cache contacts?
                all_contacts = requests.get(f"{API_URL}/contacts").json()
                for c in all_contacts:
                    if c['email'] == target_email:
                        contact_id = c['id']
                        break
        except Exception as e:
            print(f"Error contact {client_name}: {e}")
            continue

        if not contact_id:
            print(f"Could not resolve contact for {client_name}")
            continue

        # B. Create Opportunity
        opp_name = f"{client_name} - {workstream}"
        stage = get_stage(confirmed)
        owner_id = user_map.get(owner_name)
        value = 10000 if stage != "Signed" else 50000 # Dummy logic for now

        opp_payload = {
            "name": opp_name,
            "stage": stage,
            "value": value,
            "contact_id": contact_id,
            "owner_id": owner_id
        }

        try:
            res = requests.post(f"{API_URL}/opportunities", json=opp_payload)
            if res.status_code in [200, 201]:
                print(f"Created Deal: {opp_name} ({stage})")
            else:
                print(f"Failed Deal {opp_name}: {res.text}")
        except Exception as e:
            print(f"Error opp {opp_name}: {e}")

if __name__ == "__main__":
    rehydrate()
