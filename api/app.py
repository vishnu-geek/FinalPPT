import sys
from flask import Flask, send_file, jsonify
import subprocess
from datetime import datetime
import os
import base64

app = Flask(__name__)

import base64

def generate_pdf(ticker):
    try:
        # Correctly resolve the path to the stocks.py script
        script_path = os.path.join(os.path.dirname(__file__), 'stocks.py')
        result = subprocess.run(
            [sys.executable, script_path, ticker],
            capture_output=True, text=True, check=True
        )
        
        # Extract the filename from the script output
        output_lines = result.stdout.splitlines()
        for line in output_lines:
            if "PDF report saved as:" in line:
                pdf_filename = line.split(":")[-1].strip()
                break
        else:
            return {"error": "PDF filename not found in script output", "output": result.stdout}

        # Check if the file was generated
        if os.path.exists(pdf_filename):
            with open(pdf_filename, "rb") as f:
                pdf_buffer = f.read()
            # Encode the PDF buffer in Base64
            pdf_base64 = base64.b64encode(pdf_buffer).decode('utf-8')
            return {"message": "PDF generated successfully", "filename": pdf_filename, "buffer": pdf_base64}
        else:
            return {"error": "PDF generation failed", "output": result.stdout}

    except subprocess.CalledProcessError as e:
        return {
            "error": "Error in Python script execution",
            "output": e.stdout,
            "error_details": e.stderr
        }
    except Exception as e:
        return {"error": str(e)}

@app.route('/generate/<ticker>')
def generate_pdf_route(ticker):
    result = generate_pdf(ticker)
    if "error" in result:
        return jsonify(result), 500
    return jsonify(result), 200

@app.route('/download/<filename>')
def download_pdf(filename):
    try:
        # Ensure the file exists before sending
        if os.path.exists(filename):
            return send_file(filename, as_attachment=True)
        else:
            return jsonify({"error": f"File {filename} not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Error downloading file: {str(e)}"}), 500

if __name__ == '__main__':  # Corrected main block check
    print("Starting Flask server...")
    app.run(debug=True)