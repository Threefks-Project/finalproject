
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

interface AIClassificationProps {
  image: File;
  onClassification: (classification: string) => void;
}

const AIClassification: React.FC<AIClassificationProps> = ({ image, onClassification }) => {
  const { t } = useTranslation();
  const [isClassifying, setIsClassifying] = useState(false);
  const [classification, setClassification] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);

  useEffect(() => {
    classifyImage();
  }, [image]);

  const classifyImage = async () => {
    setIsClassifying(true);
    
    // Simulate AI classification (in real implementation, use MobileNetV2 or similar)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock classifications based on common municipal issues
    const possibleClassifications = [
      { name: 'सडकमा खाडल', confidence: 0.92 },
      { name: 'फोहोर जमेको', confidence: 0.87 },
      { name: 'बत्ती बिग्रिएको', confidence: 0.84 },
      { name: 'नाली बन्द भएको', confidence: 0.78 },
      { name: 'ट्राफिक साइन बिग्रिएको', confidence: 0.75 },
      { name: 'पानीको पाइप फुटेको', confidence: 0.82 },
      { name: 'फुटपाथ बिग्रिएको', confidence: 0.89 }
    ];
    
    const randomClassification = possibleClassifications[
      Math.floor(Math.random() * possibleClassifications.length)
    ];
    
    setClassification(randomClassification.name);
    setConfidence(randomClassification.confidence);
    setIsClassifying(false);
    onClassification(randomClassification.name);
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'text-green-600 bg-green-100';
    if (conf >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceIcon = (conf: number) => {
    if (conf >= 0.8) return <CheckCircle className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  return (
    <div className="space-y-4 animate-slide-in-right">
      <label className="block text-lg font-semibold text-municipal-blue">
        {t('ai_classification')}
      </label>
      
      <div className="municipal-card p-6">
        {isClassifying ? (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Brain className="h-8 w-8 text-municipal-blue animate-pulse" />
              <Loader2 className="h-6 w-6 animate-spin text-municipal-blue" />
            </div>
            <h3 className="font-semibold text-municipal-blue mb-2">
              {t('ai_analyzing')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('please_wait')}
            </p>
          </div>
        ) : classification ? (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Brain className="h-8 w-8 text-municipal-blue" />
              {getConfidenceIcon(confidence)}
            </div>
            <h3 className="font-semibold text-municipal-blue mb-2">
              {t('identified_issue')}
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="text-xl font-semibold text-municipal-blue mb-2">
                {classification}
              </p>
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(confidence)}`}>
                {getConfidenceIcon(confidence)}
                <span>{t('confidence')}: {(confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              {t('if_wrong_description')}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AIClassification;
