import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaClipboard } from "react-icons/fa";
import { toast } from "react-hot-toast";

const formatFeedbackText = (feedback) => {
  const parts = feedback.split(/(```cpp|```)/);
  let isCodeBlock = false;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
      {parts.map((part, index) => {
        if (part === "```cpp") {
          isCodeBlock = true;
          return null;
        } else if (isCodeBlock && part !== "```") {
          isCodeBlock = false;
          return (
            <div key={index} className="relative bg-gray-900 p-4 rounded-md shadow-md border border-green-500">
              <pre className="text-green-400 text-sm overflow-x-auto">{part.trim()}</pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(part.trim());
                  toast.success("Código copiado!");
                }}
                className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white p-1 rounded-md shadow-md"
              >
                <FaClipboard />
              </button>
            </div>
          );
        } else if (part === "```") {
          return null;
        } else {
          return (
            <ReactMarkdown
              key={index}
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ node, ...props }) => <p className="text-gray-300 mt-2" {...props} />,
                strong: ({ node, ...props }) => <strong className="text-yellow-400 bg-gray-700 px-2 py-1 rounded-md" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside text-gray-300 ml-4" {...props} />,
              }}
            >
              {part}
            </ReactMarkdown>
          );
        }
      })}
    </div>
  );
};

const FeedbackSection = ({ feedback, handleAddFeedbackToPR }) => {
  if (!feedback) return null;

  return (
    <div className="mt-8 p-6 bg-gray-700 rounded-md shadow-lg">
      <h2 className="text-xl font-semibold mb-4">📌 Feedback del Código</h2>
      <div className="space-y-4">{formatFeedbackText(feedback.feedback)}</div>

      <button
        onClick={handleAddFeedbackToPR}
        className="mt-4 w-full bg-green-600 px-6 py-2 rounded-md text-white hover:bg-green-500 transition shadow-lg"
      >
        Agregar Pull Request
      </button>
    </div>
  );
};

export default FeedbackSection;
