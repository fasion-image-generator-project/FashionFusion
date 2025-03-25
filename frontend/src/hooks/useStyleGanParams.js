import { useState, useCallback } from 'react';
import { DEFAULT_STYLE_GAN_PARAMS } from '../constants/presets';

const useStyleGanParams = () => {
  const [params, setParams] = useState(DEFAULT_STYLE_GAN_PARAMS);
  const [activePreset, setActivePreset] = useState(null);
  const [customPresets, setCustomPresets] = useState(() => {
    const saved = localStorage.getItem('styleGanCustomPresets');
    return saved ? JSON.parse(saved) : {};
  });

  const handleParamChange = useCallback((param, value) => {
    setParams(prev => ({
      ...prev,
      [param]: value
    }));
    setActivePreset(null);
  }, []);

  const handlePresetClick = useCallback((presetName, presetValues) => {
    setParams(presetValues);
    setActivePreset(presetName);
  }, []);

  const handleSavePreset = useCallback(() => {
    const presetName = prompt('Enter a name for this preset:');
    if (presetName) {
      const newPresets = {
        ...customPresets,
        [presetName]: { ...params }
      };
      setCustomPresets(newPresets);
      localStorage.setItem('styleGanCustomPresets', JSON.stringify(newPresets));
      setActivePreset(presetName);
    }
  }, [params, customPresets]);

  const resetParams = useCallback(() => {
    setParams(DEFAULT_STYLE_GAN_PARAMS);
    setActivePreset(null);
  }, []);

  return {
    params,
    activePreset,
    customPresets,
    handleParamChange,
    handlePresetClick,
    handleSavePreset,
    resetParams
  };
};

export default useStyleGanParams; 