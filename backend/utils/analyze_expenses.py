import json
from datetime import datetime, timedelta

def analyze(expenses):
    tips = []
    last_30_days = datetime.now() - timedelta(days=30)
    recent_expenses = [e for e in expenses if datetime.fromisoformat(e['date']) >= last_30_days]

    category_totals = {}
    for e in recent_expenses:
        cat = e['category']
        category_totals[cat] = category_totals.get(cat, 0) + float(e['amount'])

    for cat, total in category_totals.items():
        if total > 5000:
            tips.append(f"You’re spending a lot on {cat}. Try to reduce it by 15%.")
        if total > 0 and total < 100:
            tips.append(f"Your {cat} spending is quite low. Good job!")

    return tips

if __name__ == "__main__":
    import sys
    data = json.loads(sys.stdin.read())
    tips = analyze(data)
    print(json.dumps(tips))  # Make sure to print pure JSON
