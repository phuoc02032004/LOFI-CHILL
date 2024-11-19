import React, { useState, useEffect } from 'react';
import './PresetPage.css';
import NavbarAD from '../NavbarAdmin/Navbar';
import { AiOutlineCamera } from "react-icons/ai";
import { GiSoundWaves } from "react-icons/gi";
import { FaCoffee } from "react-icons/fa";
import { BsBuilding } from "react-icons/bs";
import { HiMoon } from "react-icons/hi";
import { FaHeadphones } from "react-icons/fa";
import { FaRadio } from "react-icons/fa6";
import { FaCloudShowersHeavy } from "react-icons/fa6";
import { PiSunHorizonFill } from "react-icons/pi";
import { SlVolumeUp } from "react-icons/sl";

import { getAllVisual } from '../../../services/visual';
import { getAllPlaylists } from '../../../services/playlist'
import { getAllSound } from '../../../services/sound';
import { createPreset, getAllPreset, updatePreset, deletePreset } from '../../../services/presets';


function PresetPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [presetToEdit, setPresetToEdit] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [visualsData, setVisualsData] = useState([]);

  const [initialSoundsData, setSoundData] = useState([]);

  const [stationsData, setStationData] = useState([]);

  const [presets, setPresets] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [presetsPerPage] = useState(10);

  const [currentPresets, setCurrentPresets] = useState([]);
  const [selectedSounds, setSelectedSounds] = useState([]);

  useEffect(() => {
    const fetchPreset = async () => {
      try {
        const response = await getAllPreset();
        setCurrentPresets(response);
      } catch (error) {
        console.error('Error fetching Presets:', error);
      }
    };
    fetchPreset();
  }, []);

  useEffect(() => {
    const fetchVisuals = async () => {
      try {
        const visuals = await getAllVisual();
        setVisualsData(visuals);
      } catch (error) {
        console.error('Error fetching visuals:', error);
      }
    };

    fetchVisuals();
  }, []);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const playlist = await getAllPlaylists();
        setStationData(playlist);
      } catch (error) {
        console.error('Error fetching Playlist:', error);
      }
    };
    fetchPlaylists();
  }, []);

  useEffect(() => {
    const fetchSoundsData = async () => {
      try {
        const sounds = await getAllSound();
        setSoundData(sounds);
      } catch (error) {
        console.error('Error fetching Sound:', error);
      }
    }
    fetchSoundsData();
  }, []);

  useEffect(() => {
    const indexOfLastPreset = currentPage * presetsPerPage;
    const indexOfFirstPreset = indexOfLastPreset - presetsPerPage;
    setCurrentPresets(presets.slice(indexOfFirstPreset, indexOfLastPreset));
  }, [currentPage, presets]);

  const handleAddClick = () => {
    setIsAddModalOpen(true);
    setSelectedSounds([]);
  };

  const handleEdit = (preset) => {
    setPresetToEdit(preset);
    setIsEditModalOpen(true);
    setSelectedSounds(preset.sounds.map(sound => sound.title));
  };

  const handleDelete = async (preset) => {
    setPresetToDelete(preset);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setPresetToDelete(null);
    setIsEditModalOpen(false);
    setPresetToEdit(null);
    setIsAddModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      await deletePreset(presetToDelete.id);
      setPresets(presets.filter((p) => p.id !== presetToDelete.id));
      setIsDeleteModalOpen(false);
      setPresetToDelete(null);
    } catch (error) {
      console.error('Error during Preset deletion:', error);
    }
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    const updatedName = document.getElementById('editPresetName')?.value || '';
    const updatedDescription = document.getElementById('editPresetDescription')?.value || '';
    // const updatedPlaylist = document.getElementById('editPresetPlaylist')?.value || '';
    // const updatedVisual = document.getElementById('editPresetVisuals')?.value || '';

    // Cập nhật sounds với volume > 0
    // const updatedSounds = initialSoundsData
    //   .filter(sound => selectedSounds.includes(sound.title))
    //   .map((sound) => {
    //     const volumeElement = document.getElementById(`volume-${sound.title}`);
    //     const volume = volumeElement ? parseFloat(volumeElement.value) : 0;
    //     return { title: sound.title, volume }; // Make sure `title` is included here
    //   });

    const updatedPresetData = {
      Title: updatedName,
      Description: updatedDescription,
      // playlist: stationsData.find(station => station.name === updatedPlaylist),
      // visual: visualsData.find(img => img.id === updatedVisual),
      // sounds: updatedSounds,
    };

    try {
      await updatePreset(presetToEdit.id, updatedPresetData);
      const presetIndex = presets.findIndex((p) => p.id === presetToEdit.id);
      const updatedPresets = [...presets];
      updatedPresets[presetIndex] = { ...presetToEdit, ...updatedPresetData };
      setPresets(updatedPresets);
      setIsEditModalOpen(false);
      setPresetToEdit(null);

      console.log('Preset updated successfully');
    } catch (error) {
      console.error('Error updating preset:', error);
    }
  };

  const handleSaveAdd = async (event) => {
    event.preventDefault();
    const newPresetName = document.getElementById('newPresetName').value;
    const newPresetDescription = document.getElementById('newPresetDescription').value;
    const newPresetPlaylist = document.getElementById('newPresetPlaylist').value;
    const newPresetVisuals = document.getElementById('newPresetVisuals').value;

    // Tạo mảng `newPresetSounds` chứa soundId và volume của mỗi sound được chọn
    const newPresetSounds = selectedSounds.map((soundName) => ({
      soundId: initialSoundsData.find(sound => sound.title === soundName)?.id,
      volume: parseFloat(document.getElementById(`volume-${soundName}`).value),
    }));

    // Lấy ID của các mục playlist và visual để truyền vào API
    const playlistId = stationsData.find(station => station.name === newPresetPlaylist)?.id;
    const visualId = visualsData.find(visual => visual.id === newPresetVisuals)?.id;

    console.log('Visual ID:', visualId);

    try {
      // Gọi API `createPreset` với dữ liệu đúng định dạng
      const response = await createPreset({
        Title: newPresetName,                 // Title
        Description: newPresetDescription,    // Description
        playlistId,                           // playlistId
        visualId,                             // visualId
        sounds: newPresetSounds               // Truyền toàn bộ mảng sounds
      });

      console.log('Preset created successfully:', response);

      const newPreset = {
        id: presets.length + 1,
        name: newPresetName,
        playlist: stationsData.find(station => station.name === newPresetPlaylist),
        visual: visualsData.find(img => img.name === newPresetVisuals),
        sounds: newPresetSounds,
        isDefault: false
      };

      setPresets([...presets, newPreset]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error creating preset:', error);
    }
  };


  const handleSoundSelection = (event) => {
    const soundName = event.target.value;
    if (event.target.checked) {
      setSelectedSounds((prev) => [...prev, soundName]);
    } else {
      setSelectedSounds((prev) => prev.filter(name => name !== soundName));
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(presets.length / presetsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <NavbarAD />
      <button className='btn-add' onClick={handleAddClick}>ADD</button>

      {isAddModalOpen && (
        <div className="add-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseModal}>×</span>
            <h2>Add New Preset</h2>
            <form onSubmit={handleSaveAdd}>
              <label htmlFor="newPresetName">Preset Name:</label>
              <input
                type="text"
                id="newPresetName"
                name="newPresetName"
                required
              />

              <label htmlFor="newPresetDesctiption">Preset Description:</label>
              <input
                type="text"
                id="newPresetDescription"
                name="newPresetDescription"
                required
              />

              <label htmlFor="newPresetPlaylist">Genere:</label>
              <select className='choose-song' id="newPresetPlaylist" name="newPresetPlaylist" required>
                {stationsData.map((station) => (
                  <option key={station.id} value={station.name}>
                    {station.name}
                  </option>
                ))}
              </select>

              <label htmlFor="newPresetVisuals">Visuals:</label>
              <select className='choose-song' id="newPresetVisuals" name="newPresetVisuals" required>
                {visualsData.map((visual) => (
                  <option key={visual.id} value={visual.id}>
                    {visual.title}
                  </option>
                ))}
              </select>

              <h3>Sounds</h3>
              <div className="sound-list-container">
                <div className="sound-list">
                  {initialSoundsData.map((sound) => (
                    <div key={sound.id} className="sound-item">
                      <input
                        type="checkbox"
                        id={`sound-${sound.title}`}
                        value={sound.title}
                        checked={selectedSounds.includes(sound.title)}
                        onChange={handleSoundSelection}
                      />
                      <label htmlFor={`sound-${sound.title}`}>{sound.title}</label>
                      <input
                        type="number"
                        id={`volume-${sound.title}`}
                        min="0"
                        max="1"
                        step="0.1"
                        placeholder="Volume"
                        defaultValue={0.5}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit">Save Preset</button>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="edit-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseModal}>×</span>
            <h2>Edit Preset</h2>
            <form onSubmit={handleSaveEdit}>
              <label htmlFor="editPresetName">Preset Name:</label>
              <input
                type="text"
                id="editPresetName"
                name="editPresetName"
                defaultValue={presetToEdit?.name || ''}
                required
              />

              <label htmlFor="editPresetDescription">Preset Description:</label>
              <input
                type="text"
                id="editPresetDescription"
                name="editPresetDescription"
                defaultValue={presetToEdit?.description || ''}
                required
              />

              {/* <label htmlFor="editPresetPlaylist">Genre:</label>
              <select
                className="choose-song"
                id="editPresetPlaylist"
                name="editPresetPlaylist"
                defaultValue={presetToEdit?.playlist?.name || ''}
                required
              >
                {stationsData.map((station) => (
                  <option key={station.id} value={station.name}>
                    {station.name}
                  </option>
                ))}
              </select>

              <label htmlFor="editPresetVisuals">Visuals:</label>
              <select
                className="choose-song"
                id="editPresetVisuals"
                name="editPresetVisuals"
                defaultValue={presetToEdit?.visual?.id || ''}
                required
              >
                {visualsData.map((visual) => (
                  <option key={visual.id} value={visual.id}>
                    {visual.title}
                  </option>
                ))}
              </select>

              <h3>Sounds</h3>
              <div className="sound-list-container">
                <div className="sound-list">
                  {initialSoundsData.map((sound) => {
                    const presetSound = presetToEdit?.sounds?.find((s) => s.title === sound.title);
                    const isSelected = selectedSounds.includes(sound.title);
                    const volume = presetSound ? presetSound.volume : 0.5; // volume mặc định nếu chưa có

                    return (
                      <div key={sound.id} className="sound-item">
                        <input
                          type="checkbox"
                          id={`sound-${sound.id}`}
                          value={sound.title}
                          checked={isSelected}
                          onChange={handleSoundSelection}
                        />
                        <label htmlFor={`sound-${sound.id}`}>{sound.title}</label>
                        <input
                          type="number"
                          id={`volume-${sound.title}`}
                          min="0"
                          max="1"
                          step="0.1"
                          placeholder="Volume"
                          defaultValue={volume} // volume của preset nếu có
                        />
                      </div>
                    );
                  })}
                </div>
              </div> */}

              <button type="submit">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      <div className="preset-container">
        {currentPresets.map((preset) => (
          <div key={preset.id} className="preset-card">
            <img src={preset.visualImgUrl} alt={preset.name} />
            <div className="preset-info-ad">
              <h3>{preset.name}</h3>
              <p>
                <GiSoundWaves />
                {preset.sounds.map((sound, index) => (
                  <span key={index}>{sound.soundTitle} ({sound.soundVol})</span>
                ))}
              </p>
              <div className="button-group">
                <button className='btn-edit' onClick={() => handleEdit(preset)}>EDIT</button>
                <button className='btn-dele' onClick={() => handleDelete(preset)}>DELETE</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}
      </div>

      {isDeleteModalOpen && (
        <div className="delete-modal">
          <div className="delete-content">
            <span className="close-modal" onClick={handleCloseModal}>×</span>
            <h2>Are you sure you want to delete {presetToDelete?.name}?</h2>
            <button className='btn-delete' onClick={handleConfirmDelete}>DELETE</button>
          </div>
        </div>
      )}

    </div>

  );
}

export default PresetPage;