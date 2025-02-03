import React, { useState, useEffect} from "react";
import {useNavigate } from 'react-router-dom';
import './gallery.css'
import './calculator.js'

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ImageDatabase", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const addImageToDB = async (image) => {
  const db = await openDatabase();
  const transaction = db.transaction("images", "readwrite");
  const store = transaction.objectStore("images");
  return store.add({ image });
};

const getImagesFromDB = async () => {
  const db = await openDatabase();
  return new Promise((resolve) => {
    const transaction = db.transaction("images", "readonly");
    const store = transaction.objectStore("images");
    const request = store.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
};

const deleteImageFromDB = async (id) => {
  const db = await openDatabase();
  const transaction = db.transaction("images", "readwrite");
  const store = transaction.objectStore("images");
  store.delete(id);
};



const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      const storedImages = await getImagesFromDB();
      setImages(storedImages);
    };
    fetchImages();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveImage = async () => {
    if (preview) {
      const id = await addImageToDB(preview);
      setImages([...images, { id, image: preview }]);
      setPreview(null);
    }
  };

  const handleDelete = async (id) => {
    await deleteImageFromDB(id);
    setImages(images.filter((img) => img.id !== id));
  };

  const handleDownload = (image) => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "image.png";
    link.click();
  };
  const navigate = useNavigate();

  const homePg = () => {
    navigate("/");
  }

  return (
    <div className="container p-4">
        <button className="btn galleryBtnColor" onClick={homePg}><b>Home</b></button>
      <h1 className="text-center mb-4">Image Uploader</h1>
      <div className="border border-primary p-4 rounded text-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="form-control mb-3"
        />
        <button
          className="btn btn-primary"
          onClick={() => document.querySelector("input[type='file']").click()}
        >
          Upload
        </button>
      </div>

      {preview && (
        <div className="mt-4 previewDiv">
          <h5>Preview</h5>
          <img
            src={preview}
            alt="Preview"
            className="img-width rounded shadow-sm "
          />
          <button className="btn btn-success mt-3" onClick={saveImage}>
            Save media
          </button>
        </div>
      )}

      <div className="mt-1">
        <h5>Gallery</h5>
        <div className="row g-3">
          {images.map((img) => (
            <div className="col-6 col-md-4" key={img.id}>
              <div className="position-relative">
                <img
                  src={img.image}
                  alt={`Stored`}
                  className="img-fluid rounded shadow-sm"
                />
                <div className="dropdown position-absolute top-0 end-0 m-2">
                  <button
                    className="btn btn-light btn-sm dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    ⋮
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => handleDelete(img.id)}
                      >
                        Delete
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-primary"
                        onClick={() => handleDownload(img.image)}
                      >
                        Save
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
