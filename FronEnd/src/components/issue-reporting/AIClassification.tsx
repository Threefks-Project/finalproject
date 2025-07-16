import React, { useEffect, useState } from "react";
import { Brain, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

declare const ort: any;

interface AIClassificationProps {
  image: File;
  onClassification: (classification: string) => void;
}

const AIClassification: React.FC<AIClassificationProps> = ({ image, onClassification }) => {
  const { t } = useTranslation();
  const [isClassifying, setIsClassifying] = useState(false);
  const [classification, setClassification] = useState("Unknown");
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const labels = ["garbage", "pothole"];
  const CONFIDENCE_THRESHOLD = 0.8;

  useEffect(() => {
    if (image) {
      classifyImage(image);
    }
  }, [image]);

  async function classifyImage(imageFile: File) {
    setIsClassifying(true);
    setError(null);
    try {
      const session = await ort.InferenceSession.create("/mobilenetv2.onnx");

      const canvas = await loadImageToCanvas(imageFile);
      const inputTensor = preprocessImage(canvas);

      const feeds = {
        [session.inputNames[0]]: new ort.Tensor("float32", inputTensor, [1, 3, 224, 224]),
      };

      const outputMap = await session.run(feeds);
      const rawOutput = outputMap[session.outputNames[0]].data as Float32Array;
      const probabilities = softmax(rawOutput);

      const maxProb = Math.max(...probabilities);
      const predIndex = probabilities.findIndex((v) => v === maxProb);

      const secondMaxProb = Math.max(...probabilities.filter((v, i) => i !== predIndex));

      const isConfidentEnough = maxProb >= CONFIDENCE_THRESHOLD;
      const isPredictionDistinct = (maxProb - secondMaxProb) >= 0.2; // not too close

      if (!isConfidentEnough || !isPredictionDistinct) {
        setClassification("Incorrect");
        setConfidence(maxProb);
        onClassification("Incorrect");
      } else {
        setClassification(labels[predIndex]);
        setConfidence(maxProb);
        onClassification(labels[predIndex]);
      }
    } catch (e) {
      console.error(e);
      setError("Model inference failed. Check your model path and network.");
      setClassification("Unknown");
      setConfidence(0);
      onClassification("Unknown");
    } finally {
      setIsClassifying(false);
    }
  }

  function softmax(arr: Float32Array | number[]): number[] {
    const exps = [...arr].map((x) => Math.exp(x));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((x) => x / sum);
  }

  function loadImageToCanvas(file: File): Promise<HTMLCanvasElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 224;
        canvas.height = 224;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, 224, 224);
        resolve(canvas);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  function preprocessImage(canvas: HTMLCanvasElement): Float32Array {
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.getImageData(0, 0, 224, 224);
    const { data } = imageData;

    const floatData = new Float32Array(3 * 224 * 224);
    for (let i = 0; i < 224 * 224; i++) {
      const r = data[i * 4] / 255;
      const g = data[i * 4 + 1] / 255;
      const b = data[i * 4 + 2] / 255;

      floatData[i] = (r - 0.485) / 0.229;
      floatData[i + 224 * 224] = (g - 0.456) / 0.224;
      floatData[i + 2 * 224 * 224] = (b - 0.406) / 0.225;
    }
    return floatData;
  }

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return "text-green-600 bg-green-100";
    if (conf >= 0.6) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getConfidenceIcon = (conf: number) => {
    if (conf >= 0.8) return <CheckCircle className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  return (
    <div className="space-y-4 animate-slide-in-right">
      <label className="block text-lg font-semibold text-municipal-blue">
        {t("ai_classification")}
      </label>

      <div className="municipal-card p-6">
        {isClassifying ? (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Brain className="h-8 w-8 text-municipal-blue animate-pulse" />
              <Loader2 className="h-6 w-6 animate-spin text-municipal-blue" />
            </div>
            <h3 className="font-semibold text-municipal-blue mb-2">{t("ai_analyzing")}</h3>
            <p className="text-gray-600 text-sm">{t("please_wait")}</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600 animate-pulse" />
            </div>
            <h3 className="font-semibold text-red-600 mb-2">{t("error")}</h3>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Brain className="h-8 w-8 text-municipal-blue" />
              {getConfidenceIcon(confidence)}
            </div>
            <h3 className="font-semibold text-municipal-blue mb-2">{t("identified_issue")}</h3>
            <div className={`bg-blue-50 rounded-lg p-4 mb-4`}>
              <p className="text-xl font-semibold text-municipal-blue mb-2">{classification}</p>
              <div
                className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(
                  confidence
                )}`}
              >
                {getConfidenceIcon(confidence)}
                <span>{t("confidence")}: {(confidence * 100).toFixed(2)}%</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{t("if_wrong_description")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIClassification;
