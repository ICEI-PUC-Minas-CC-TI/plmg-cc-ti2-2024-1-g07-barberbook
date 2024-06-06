import cv2
import mediapipe as mp
import numpy as np
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)

def get_face_shape(image, landmarks):
    face_contour_pts = []
    for landmark_pt in landmarks:
        x = int(landmark_pt.x * image.shape[1])
        y = int(landmark_pt.y * image.shape[0])
        face_contour_pts.append((x, y))

    face_contour_pts = np.array(face_contour_pts, dtype=np.int32)
    rect = (0, 0, image.shape[1], image.shape[0])
    subdiv = cv2.Subdiv2D(rect)
    for pt in face_contour_pts:
        subdiv.insert((int(pt[0]), int(pt[1])))
    triangles = subdiv.getTriangleList()

    for t in triangles:
        pt1 = (int(t[0]), int(t[1]))
        pt2 = (int(t[2]), int(t[3]))
        pt3 = (int(t[4]), int(t[5]))
        triangle_pts = np.array([pt1, pt2, pt3], np.int32)
        cv2.drawContours(image, [triangle_pts], 0, (255, 255, 255), 1)

    x, y, w, h = cv2.boundingRect(face_contour_pts)
    return image, (x, y, w, h)

def process_image(image_base64):
    try:
        image_bytes = base64.b64decode(image_base64)
        image_arr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(image_arr, cv2.IMREAD_COLOR)

        mp_face_mesh = mp.solutions.face_mesh
        face_mesh = mp_face_mesh.FaceMesh()

        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        result = face_mesh.process(rgb_image)

        if result.multi_face_landmarks:
            face_landmarks = result.multi_face_landmarks[0].landmark
            image_with_landmarks, face_rect = get_face_shape(image.copy(), face_landmarks)
            x, y, w, h = face_rect

            # Add margins to the face rectangle
            margin_factor = 0.4  # 40% margin
            x_margin = int(w * margin_factor)
            y_margin = int(h * margin_factor)

            x_start = max(0, x - x_margin)
            y_start = max(0, y - y_margin)
            x_end = min(image.shape[1], x + w + x_margin)
            y_end = min(image.shape[0], y + h + y_margin)

            cropped_image = image_with_landmarks[y_start:y_end, x_start:x_end]
            return cropped_image, "true"
        else:
            return None, "false"
    except Exception as e:
        logging.error(f"Error processing image: {e}")
        return None, "Erro ao processar a imagem."

@app.route('/face_detect', methods=['POST'])
def face_shape():
    image_base64 = request.json.get('image')
    if not image_base64:
        return jsonify({'error': 'Imagem não fornecida'}), 400

    image_with_landmarks, message = process_image(image_base64)

    if image_with_landmarks is not None:
        _, buffer = cv2.imencode('.jpg', image_with_landmarks)
        image_bytes = buffer.tobytes()
        image_base64_landmarks = base64.b64encode(image_bytes).decode('utf-8')

        return jsonify({'return': message, 'image': image_base64_landmarks})
    else:
        return jsonify({'return': message}), 500

if __name__ == '__main__':
    app.run(debug=True)
