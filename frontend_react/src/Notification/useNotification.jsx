import { useState } from 'react';

const useNotification = () => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  const showNotification = (text, ms) => {
    setVisible(true);
    setText(text);
    setTimeout(() => {
      setVisible(false);
    }, ms);
  };

  return {
    visible,
    text,
    showNotification,
  };
};

export default useNotification;
