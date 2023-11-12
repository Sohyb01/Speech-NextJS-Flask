# This is the GoogleTranslator version of the backend
from flask import Flask, request, jsonify
from flask_cors import CORS
from deep_translator import GoogleTranslator

app = Flask(__name__)
cors = CORS(app)

@app.route('/translate/google', methods=['POST'])
def translate_text():
    # Get input data from the request
    data = request.get_json()
    text = data.get('text')
    from_language = data.get('from_language')[0:2]
    to_language = data.get('to_language')

    # Perform translation
    try:
        translator = GoogleTranslator(source=from_language, target=to_language)
        translation = translator.translate(text)
        return jsonify({'translation': translation})
    except Exception as e:
        print(translation)
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
