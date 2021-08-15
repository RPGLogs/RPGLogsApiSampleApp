// Adapted from: https://dev.to/amitchauhan/syntax-highlighting-with-prismjs-and-react-1lep

import React, { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism.css";

export default function Code({ children, language }) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);
  return (
    <div>
      <pre>
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  );
}