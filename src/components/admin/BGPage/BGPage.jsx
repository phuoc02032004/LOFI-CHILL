import React, { useState, useEffect } from 'react';
import './BGPage.css';
import NavbarAD from '../NavbarAdmin/Navbar';
import { createVisual, getAllVisual, updateVisual, deleteVisual } from '../../../services/visual';

function BGPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(null);

  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(5);

  useEffect(() => {
    fetchVisuals();
  }, []);

  const fetchVisuals = async () => {
    try {
      const data = await getAllVisual();
      setImages(data);
    } catch (error) {
      console.error('Error fetching visuals:', error);
    }
  };

  const handleEdit = (image) => {
    setImageToEdit(image);
    setIsEditModalOpen(true);
  };

  const handleDelete = (image) => {
    setImageToDelete(image);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setImageToDelete(null);
    setIsEditModalOpen(false);
    setImageToEdit(null);
    setIsAddModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteVisual(imageToDelete.id);
      setImages(images.filter((i) => i.id !== imageToDelete.id));
    } catch (error) {
      console.error('Error during Visual deletion:', error);
    } finally {
      setIsDeleteModalOpen(false);
      setImageToDelete(null);
    }
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    const updatedName = document.getElementById('editVisualName').value;
    const updatedImageFile = document.getElementById('editImageFile').files[0];
    const updatedVideoFile = document.getElementById('editVideoFile').files[0];

    try {
      await updateVisual(imageToEdit.id, updatedName, updatedImageFile, updatedVideoFile);
      await fetchVisuals();
      setIsEditModalOpen(false);
      setImageToEdit(null);
    } catch (error) {
      console.error('Error updating visual:', error);
    }
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = async (event) => {
    event.preventDefault();
    const newVisualTitle = document.getElementById('newVisualName').value;
    const newImageFile = document.getElementById('newImageFile').files[0];
    const newVideoFile = document.getElementById('newVideoFile').files[0];

    try {
      await createVisual(newVisualTitle, newImageFile, newVideoFile);
      await fetchVisuals();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding visual:', error);
    }
  };

  // Tính toán chỉ số của phần tử trên từng trang
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage); // Hình ảnh trên trang hiện tại

  // Tạo số trang
  const totalPages = Math.ceil(images.length / imagesPerPage); // Số trang tổng
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <NavbarAD />
      <button className='btn-add' onClick={handleAddClick}>ADD</button>

      {isAddModalOpen && (
        <div className="add-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseModal}>×</span>
            <h2>Add New Visual</h2>
            <form onSubmit={handleSaveAdd}>
              <label htmlFor="newVisualName">Visual Title:</label>
              <input type="text" id="newVisualName" name="newVisualName" required />

              <label htmlFor="newImageFile">Select Thumbnail:</label>
              <input type="file" id="newImageFile" name="newImageFile" accept="image/*" />

              <label htmlFor="newVideoFile">Select Video File:</label>
              <input type="file" id="newVideoFile" name="newVideoFile" accept="video/*" />

              <button type="submit">Save Visual</button>
            </form>
          </div>
        </div>
      )}

      <div className="image-container-n">
        <div className="image-row">
          {currentImages.map((image, index) => (
            <div key={index} className="image-card">
              <img src={image.urlImg} alt={image.title} />
              <div className="image-info">
                <h3>{image.title}</h3>
                <div className="button-group">
                  <button className='btn-edit' onClick={() => handleEdit(image)}>EDIT</button>
                  <button className='btn-dele' onClick={() => handleDelete(image)}>DELETE</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hiển thị phân trang */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modal Edit */}
      {isEditModalOpen && (
        <div className="edit-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseModal}>×</span>
            <h2>Edit Visual</h2>
            <form onSubmit={handleSaveEdit}>
              <label htmlFor="editVisualName">Visual Title:</label>
              <input type="text" id="editVisualName" name="editVisualName" defaultValue={imageToEdit?.name} required />

              <label htmlFor="editImageFile">Select Thumbnail:</label>
              <input type="file" id="editImageFile" name="editImageFile" accept="image/*" />

              <label htmlFor="editVideoFile">Select Video File:</label>
              <input type="file" id="editVideoFile" name="editVideoFile" accept="video/*" />

              <button type="submit">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {isDeleteModalOpen && (
        <div className="delete-modal">
          <div className="delete-content">
            <span className="close-modal" onClick={handleCloseModal}>×</span>
            <h2>Are you sure you want to delete this visual?</h2>
            <button className='btn-delete' onClick={handleConfirmDelete}>DELETE</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BGPage;
