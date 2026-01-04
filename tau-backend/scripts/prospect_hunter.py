import os
import glob
import csv
import json
import logging
from typing import Dict, List, Any
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger("ProspectHunter")

TARGET_MAP = {
    # CLIENTS (Group A)
    "The 7Stars": ["7stars.co.uk", "the7stars.co.uk"],
    "Intermedia": ["intermedia-global.com"],
    "PPL": ["ppl.com", "pplnet.com"],
    "Midnite": ["midnite.com"],
    "SMG": ["smg.com", "starcom"], 
    "Proofpoint": ["proofpoint.com"],
    "Sainsburys": ["sainsburys.co.uk", "sainsburys-bank.co.uk"],
    "Zepz": ["zepz.io", "worldremit.com"],
    "Tombola": ["tombola.com", "tombola.co.uk", "flutter.com"],
    "RGE": ["rge.com"],
    "MIQ": ["miq.com", "miqdigital.com"],
    "Howden": ["howden.com", "howdengroup.com"],
    "Bountiful Cow": ["bountifulcow.com"],
    "Expedia": ["expedia.com"],
    "Rover": ["rover.com"],
    "Legend": ["legend.com"],
    "Holley": ["holley.com"],

    # PROSPECTS (Group B)
    "Project 5": ["Project 5"], # Keyword search in subject
    "Experian": ["experian.com", "experian.co.uk"],
    "Awaze": ["awaze.com"],
    "Funnelfuel": ["funnelfuel.io"],
    "Fanduel": ["fanduel.com"],
    "Vodafone": ["vodafone.com", "vodafone.co.uk"],
    "Lloyds": ["lloydsbanking.com", "lloyds.com"],
    "Radius": ["radius.com"],
    "Multilocal": ["multilocal.media"], 
    "Harvest": ["harvest.com"],
    "Lumen": ["lumen.com"],
    "DVNT": ["dvnt.com"],
    "Conde Nast": ["condenast.com"]
}

def normalize_header(headers: List[str]) -> Dict[str, str]:
    """
    Attempts to map CSV headers to standard keys: 'from', 'to', 'subject', 'date'.
    Prioritizes columns with 'address' or 'email' to avoid picking Name/Type columns.
    """
    mapping = {}
    
    # Helper to find best match
    def find_col(keywords, anti_keywords=None):
        # First pass: look for keyword + 'address' or 'email'
        for h in headers:
            lh = h.lower()
            if any(k in lh for k in keywords):
                if 'address' in lh or 'email' in lh:
                    return h
        
        # Second pass: look for keyword, avoiding anti_keywords
        for h in headers:
            lh = h.lower()
            if any(k in lh for k in keywords):
                if anti_keywords and any(ak in lh for ak in anti_keywords):
                    continue
                return h
        
        # Third pass: loose match (if no safe match found, take the first one matches keyword)
        # But for From/To we really want to avoid 'Type'
        for h in headers:
            lh = h.lower()
            if any(k in lh for k in keywords):
                return h
        return None

    mapping['from'] = find_col(['from', 'sender'], anti_keywords=['type', 'name'])
    mapping['to'] = find_col(['to', 'recipient'], anti_keywords=['type', 'name'])
    mapping['subject'] = find_col(['subject'])
    mapping['date'] = find_col(['date', 'time', 'sent', 'creation time'])
    
    # Filter out None
    return {k: v for k, v in mapping.items() if v}

def calculate_score(email: str, company: str, email_count: int) -> int:
    score = 0
    
    # Kill Switch
    if email.lower().endswith("@taums.ai"):
        return -1000
        
    # Domain Match
    # Verify if email matches company domain
    company_domains = TARGET_MAP.get(company, [])
    # Project 5 is exception
    if company == "Project 5":
        pass # No domain bonus explicitly defined for Project 5, implied context match?
             # But prompt says: "If email domain matches the Company's known domain (from TARGET_MAP), add +50."
             # For Project 5, this condition usually won't explicitly match unless we defined domains.
             # We defined ["Project 5"] as the list. So likely no domain match bonus unless email ends with "Project 5".
    else:
        for d in company_domains:
            if f"@{d}" in email.lower() or f".{d}" in email.lower():
                score += 50
                break
    
    # Activity Match
    score += email_count
    
    return score

def run_hunter():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    uploads_dir = os.path.join(base_dir, "uploads")
    csv_pattern = os.path.join(uploads_dir, "*.csv")
    
    csv_files = glob.glob(csv_pattern)
    
    if not csv_files:
        logger.warning(f"No CSV files found in {uploads_dir}")
        return

    logger.info(f"Found {len(csv_files)} CSV files. Processing...")

    # Key: email, Value: Dict (contact info + stats)
    # Added 'count' to track occurrences
    contacts_found: Dict[str, Any] = {}
    
    for file_path in csv_files:
        logger.info(f"Reading {os.path.basename(file_path)}...")
        
        encodings = ['utf-8', 'cp1252', 'latin1']
        
        for encoding in encodings:
            try:
                with open(file_path, mode='r', encoding=encoding, errors='replace') as f:
                    reader = csv.DictReader(f)
                    
                    if not reader.fieldnames:
                        break

                    header_map = normalize_header(reader.fieldnames)
                    
                    if 'from' not in header_map or 'to' not in header_map:
                         # try to guess if it's not detected
                         pass

                    for row in reader:
                        sender = row.get(header_map.get('from', ''), '').strip()
                        recipient = row.get(header_map.get('to', ''), '').strip()
                        subject = row.get(header_map.get('subject', ''), '').strip()
                        date_str = row.get(header_map.get('date', ''), '').strip()

                        text_to_scan = f"{sender} {recipient}".lower()
                        
                        match_found = False
                        matched_company = None
                        
                        if "project 5" in subject.lower():
                            matched_company = "Project 5"
                        else:
                            for company, domains in TARGET_MAP.items():
                                if company == "Project 5": continue
                                for domain in domains:
                                    if f"@{domain}" in text_to_scan or f".{domain}" in text_to_scan:
                                        matched_company = company
                                        break
                                if matched_company: break
                        
                        if matched_company:
                            def parse_addr(addr):
                                if '<' in addr and '>' in addr:
                                    name = addr.split('<')[0].strip().replace('"', '')
                                    em = addr.split('<')[1].replace('>', '').strip()
                                    return name, em
                                return "", addr.strip()

                            s_name, s_email = parse_addr(sender)
                            r_name, r_email = parse_addr(recipient)

                            found_email = None
                            found_name = None
                            
                            if matched_company == "Project 5":
                                found_email = s_email
                                found_name = s_name
                            else:
                                domains = TARGET_MAP[matched_company]
                                s_match = any(d in s_email for d in domains)
                                r_match = any(d in r_email for d in domains)
                                
                                if s_match:
                                    found_email = s_email
                                    found_name = s_name
                                elif r_match:
                                    found_email = r_email
                                    found_name = r_name
                            
                            if found_email:
                                if found_email not in contacts_found:
                                    contacts_found[found_email] = {
                                        "company": matched_company,
                                        "contact_name": found_name or found_email.split('@')[0],
                                        "email": found_email,
                                        "last_date": date_str,
                                        "context": f"Subject: {subject}",
                                        "count": 0
                                    }
                                
                                # Increment count
                                contacts_found[found_email]["count"] += 1
                                # Update last date if newer (naive replace)
                                contacts_found[found_email]["last_date"] = date_str
                                contacts_found[found_email]["context"] = f"Subject: {subject}"

                break # success encoding
            except UnicodeDecodeError:
                continue
            except Exception as e:
                logger.error(f"Error reading {file_path}: {e}")
                break

    # Calculate Scores and Assign Primary
    final_list = []
    
    # Group by company to find max score
    company_groups = {} # company -> list of (email, score)

    for email, data in contacts_found.items():
        score = calculate_score(email, data["company"], data["count"])
        data["score"] = score
        data["is_primary"] = False # Default
        
        if score > 0:
            final_list.append(data)
            
            comp = data["company"]
            if comp not in company_groups:
                company_groups[comp] = []
            company_groups[comp].append(data)
        else:
             # Just for reporting potentially
             pass

    # Determine Primary
    for comp, members in company_groups.items():
        if members:
            # Sort by score desc
            members.sort(key=lambda x: x["score"], reverse=True)
            # Highest score gets primary
            members[0]["is_primary"] = True

    output_file = os.path.join(uploads_dir, "CRM_IMPORT_FINAL.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(final_list, f, indent=2)
    
    logger.info(f"Saved {len(final_list)} contacts to {output_file}")
    
    # Leaderboard Report
    print("\n" + "="*60)
    print(f"{'LEADERBOARD':^60}")
    print("="*60)
    
    # Sort for display: Company, then Score Desc
    final_list.sort(key=lambda x: (x["company"], -x["score"]))
    
    current_company = None
    for c in final_list:
        if c["company"] != current_company:
            print(f"\n--- {c['company']} ---")
            current_company = c["company"]
        
        primary_tag = " - PRIMARY" if c["is_primary"] else ""
        print(f"{c['contact_name']} (Score: {c['score']}){primary_tag}")
        
    # Show dropped taums.ai
    print("\n[Dropped Internal/Low Score]")
    for email, data in contacts_found.items():
        if data["score"] <= 0:
            print(f"Dropped: {email} (Score: {data['score']})")
            
    print("="*60 + "\n")

if __name__ == "__main__":
    run_hunter()
