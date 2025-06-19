import { useRecordContext } from 'react-admin';
import { Box, Avatar, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const AvatarDisplay = () => {
  const record = useRecordContext();
  const [previewUrl, setPreviewUrl] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const { setValue, trigger } = useFormContext();

  useEffect(() => {
    if (record?.avatarUrl) {
      setPreviewUrl(record.avatarUrl);
      setUrlInput(record.avatarUrl);
    }
  }, [record]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUrlInput(''); // clear URL input

    setValue('avatarFile', file); // ✅ file sẽ có trong params.data
    setValue('avatarUrl', '');    // ✅ reset url
    trigger();                    // 👈 báo form dirty để hiện nút Save
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setUrlInput(url);
    setPreviewUrl(url);
    setValue('avatarUrl', url);     // ✅ Đặt URL
    setValue('avatarFile', null);   // ✅ Xóa file nếu dùng URL
    trigger();                      // ✅ Báo form có thay đổi
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
      <Avatar src={previewUrl} sx={{ width: 120, height: 120, mb: 1 }} />
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <TextField
        label="Hoặc nhập URL ảnh"
        value={urlInput}
        onChange={handleUrlChange}
        fullWidth
        size="small"
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default AvatarDisplay;
