def generate_ai_summary(feedback):
    if not feedback:
        return {
            "summary": "No customer feedback is available for the selected period.",
            "total_feedback": 0,
            "positive": 0,
            "neutral": 0,
            "negative": 0,
            "overall_sentiment": "No Data",
            "complaint_themes": [],
            "recommendations": []
        }

    positive = 0
    neutral = 0
    negative = 0

    negative_comments = []

    for item in feedback:

        sentiment = str(item.get("sentiment", "")).strip().lower()

        if sentiment == "positive":
            positive += 1

        elif sentiment == "negative":
            negative += 1

            comment = item.get("comment") or item.get("feedback") or ""

            if comment:
                negative_comments.append(comment)

        else:
            neutral += 1

    total = len(feedback)

    # Calculate percentages
    positive_percentage = round((positive / total) * 100, 1)
    neutral_percentage = round((neutral / total) * 100, 1)
    negative_percentage = round((negative / total) * 100, 1)

    # Determine overall sentiment
    if positive > negative and positive > neutral:
        overall_sentiment = "Positive"

    elif negative > positive and negative > neutral:
        overall_sentiment = "Negative"

    else:
        overall_sentiment = "Mixed"

    # Generate overall summary
    if negative > positive:
        summary = (
            f"Customer feedback shows some areas requiring attention. "
            f"Out of {total} responses, {negative} ({negative_percentage}%) "
            f"were negative, while {positive} ({positive_percentage}%) "
            f"were positive."
        )

    elif positive > negative:
        summary = (
            f"Customer feedback is generally positive. "
            f"Out of {total} responses, {positive} ({positive_percentage}%) "
            f"were positive, compared with {negative} ({negative_percentage}%) "
            f"negative responses."
        )

    else:
        summary = (
            f"Customer feedback is mixed. "
            f"The system received {total} responses with "
            f"{positive} positive, {neutral} neutral, and "
            f"{negative} negative responses."
        )

    # Basic complaint themes
    complaint_themes = []

    keywords = {
        "Waiting Time": [
            "wait",
            "waiting",
            "queue",
            "slow",
            "long time"
        ],
        "Staff Service": [
            "staff",
            "employee",
            "service",
            "rude",
            "help"
        ],
        "Network / Connectivity": [
            "network",
            "signal",
            "connection",
            "internet",
            "connectivity"
        ],
        "Billing": [
            "bill",
            "billing",
            "payment",
            "charge",
            "cost"
        ],
        "Office Environment": [
            "office",
            "clean",
            "environment",
            "seating",
            "facility"
        ]
    }

    for theme, words in keywords.items():

        count = 0

        for comment in negative_comments:

            comment_lower = comment.lower()

            if any(word in comment_lower for word in words):
                count += 1

        if count > 0:
            complaint_themes.append({
                "theme": theme,
                "count": count
            })

    # Sort themes by frequency
    complaint_themes.sort(
        key=lambda x: x["count"],
        reverse=True
    )

    # Generate recommendations
    recommendations = []

    for theme in complaint_themes:

        if theme["theme"] == "Waiting Time":
            recommendations.append(
                "Reduce customer waiting time by improving queue management "
                "and service counter efficiency."
            )

        elif theme["theme"] == "Staff Service":
            recommendations.append(
                "Provide additional staff training focused on customer service "
                "and communication."
            )

        elif theme["theme"] == "Network / Connectivity":
            recommendations.append(
                "Investigate reported connectivity issues and improve network "
                "service reliability where required."
            )

        elif theme["theme"] == "Billing":
            recommendations.append(
                "Review billing and payment-related complaints and provide "
                "clearer explanations of charges."
            )

        elif theme["theme"] == "Office Environment":
            recommendations.append(
                "Improve the customer waiting area, seating, cleanliness, "
                "and overall office environment."
            )

    return {
        "summary": summary,

        "total_feedback": total,

        "positive": positive,
        "neutral": neutral,
        "negative": negative,

        "positive_percentage": positive_percentage,
        "neutral_percentage": neutral_percentage,
        "negative_percentage": negative_percentage,

        "overall_sentiment": overall_sentiment,

        "complaint_themes": complaint_themes,

        "recommendations": recommendations,

        "negative_comments_analyzed": len(negative_comments)
    }