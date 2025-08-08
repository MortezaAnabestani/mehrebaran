"use client";

import { useEffect } from "react";

export const toPersianDigits = (input: string | number): string => {
  const str = String(input);
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/\d/g, (d) => persianDigits[parseInt(d)]);
};

const convertTextNodes = (node: Node): void => {
  if (node.nodeType === Node.TEXT_NODE) {
    node.nodeValue = toPersianDigits(node.nodeValue || "");
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    node.childNodes.forEach(convertTextNodes);
  }
};

export const useConvertNumbersToPersian = (): void => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const observer = new MutationObserver((mutations: MutationRecord[]) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          convertTextNodes(node);
        });
      }
    });

    convertTextNodes(document.body);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);
};
