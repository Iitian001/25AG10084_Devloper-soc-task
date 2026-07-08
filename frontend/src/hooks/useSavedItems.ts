import { useState, useEffect } from "react";

export function useSavedItems(key: string = "saved_campus_items") {
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setSavedItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load saved items", e);
    }
    setIsLoaded(true);
  }, [key]);

  const toggleSave = (id: string) => {
    setSavedItems((prev) => {
      let next;
      if (prev.includes(id)) {
        next = prev.filter((i) => i !== id);
      } else {
        next = [...prev, id];
      }
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save item", e);
      }
      return next;
    });
  };

  const isSaved = (id: string) => savedItems.includes(id);

  return { savedItems, toggleSave, isSaved, isLoaded };
}
