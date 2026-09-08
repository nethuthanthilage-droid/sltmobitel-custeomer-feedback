from transformers import pipeline

sentiment_model = pipeline(
    "sentiment-analysis"
)

def analyze_comment(comment):
    """
    Analyze a customer comment and return:

    Positive
    Negative
    Neutral
    """
    if not comment:
        return "Neutral"

    comment = str(comment).strip()

    if not comment:
        return "Neutral"

    try:
        result = sentiment_model(comment)[0]

        label = result.get("label", "").upper()

        if label == "POSITIVE":
            return "Positive"

        elif label == "NEGATIVE":
            return "Negative"

        return "Neutral"

    except Exception as e:

        print("Sentiment analysis error:", e)

        return "Neutral"


def analysis(comment):

    return analyze_comment(comment)

