module.exports = async function (req, res) {
  const images = [
    "00000150-IMG_1914.jpg",
    "00000152-IMG_1926.jpg",
    "00000170-PHOTO-2024-07-02-16-07-00.jpg",
    "00000350-PHOTO-2024-09-05-15-41-14.jpg",
    "00000352-PHOTO-2024-09-05-15-41-14.jpg",
    "00000355-PHOTO-2024-09-05-15-41-14.jpg",
    "00000360-PHOTO-2024-09-05-15-41-14.jpg",
    "00000361-PHOTO-2024-09-05-15-41-14.jpg",
    "00000376-PHOTO-2024-09-05-15-41-14.jpg",
    "00000378-PHOTO-2024-09-05-15-41-14.jpg",
    "00000380-PHOTO-2024-09-05-15-41-14.jpg",
    "00000616-PHOTO-2024-12-18-21-23-24.jpg",
    "00000619-PHOTO-2024-12-18-21-23-24.jpg",
    "00000620-PHOTO-2024-12-18-21-23-24.jpg",
    "00000636-PHOTO-2024-12-18-21-23-24.jpg",
    "00000662-PHOTO-2024-12-18-21-26-31.jpg",
    "00000732-PHOTO-2025-02-27-23-28-59.jpg",
    "00000880-PHOTO-2025-03-20-23-03-50.jpg",
    "00001072-PHOTO-2025-08-04-13-09-19.jpg",
    "00001133-PHOTO-2025-08-31-21-11-00.jpg",
    "00001137-PHOTO-2025-08-31-21-11-00.jpg",
    "00001163-PHOTO-2025-08-31-21-11-01.jpg",
    "00001167-PHOTO-2025-08-31-21-11-01.jpg",
    "00001315-PHOTO-2025-10-23-23-05-26.jpg",
    "00001320-PHOTO-2025-10-23-23-05-26.jpg",
    "00001321-PHOTO-2025-10-23-23-05-26.jpg",
    "00001324-PHOTO-2025-10-23-23-05-26.jpg",
    "00001325-PHOTO-2025-10-23-23-05-26.jpg",
    "00001333-PHOTO-2025-10-23-23-05-26.jpg",
    "00001334-PHOTO-2025-10-23-23-05-26.jpg",
    "00001340-PHOTO-2025-10-23-23-05-26.jpg",
    "00001344-PHOTO-2025-10-23-23-05-26.jpg",
    "00001345-PHOTO-2025-10-23-23-05-26.jpg",
    "00001428-PHOTO-2025-12-21-03-34-02.jpg"
  ];

  const randomImage = images[Math.floor(Math.random() * images.length)];
  const imageUrl = `https://raw.githubusercontent.com/abdullahabid04/abdullahabid04/main/assets/photos/${randomImage}`;

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    
    // Read the image as an arrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Provide the Image directly instead of a redirect
    res.setHeader('Content-Type', 'image/jpeg');

    // Force strict anti-caching so GitHub Camo re-fetches it
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    res.send(buffer);
  } catch (err) {
    res.status(500).send('Error loading dynamic image');
  }
};
