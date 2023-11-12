# This is the seamless version of the translation
from seamless_translation import translation
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

@app.route('/translate/seamless', methods=['POST'])
def translate_text():
    # Get input data from the request
    data = request.get_json()
    text = data.get('text')
    languagesDict = {"ar":"arb", "ar-EG":"arz", "en":"eng","fr":"fra","es":"spa", "de":"deu"  }  # Language codes, more will be added later
    from_language = languagesDict[data.get('from_language')]
    to_language = languagesDict[data.get('to_language')]



    # Perform translation
    try:
        trans = translation(text, from_language, to_language)
        return jsonify({'translation': trans})
    except Exception as e:
        print(translation)
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
