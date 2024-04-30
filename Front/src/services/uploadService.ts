const UPLOAD_PRESET = 'Biranmeow';
const CLOUD_NAME = 'microgram1';
const UPLOAD_IMAGE_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const UPLOAD_VIDEO_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;

const uploadImg = async (file: File): Promise<any> => {
  const FORM_DATA = new FormData();

  FORM_DATA.append('file', file);
  FORM_DATA.append('upload_preset', UPLOAD_PRESET);

  try {
    const res = await fetch(UPLOAD_IMAGE_URL, {
      method: 'POST',
      body: FORM_DATA,
    });
    return res.json();
  } catch (err) {
    console.dir(err);
  }
}

const uploadVideo = async (file: File): Promise<any> => {
  const FORM_DATA = new FormData();

  FORM_DATA.append('file', file);
  FORM_DATA.append('upload_preset', UPLOAD_PRESET);
  // FORM_DATA.append('resource_type', 'video/mp4');

  try {
    const res = await fetch(UPLOAD_VIDEO_URL, {
      method: 'POST',
      body: FORM_DATA,
    });
    return res.json();
  } catch (err) {
    console.dir(err);
  }
}


export { uploadImg, uploadVideo };
