import React, { createContext, FC,useState } from 'react';


export const BubbleContext = createContext<any>({});

export const BubbleProvider: FC = ({ children }) => {
  const [bubble,setBubble] = useState(false)

  return (
    <BubbleContext.Provider value={{bubble,setBubble}}
    >
      {children}
    </BubbleContext.Provider>
  );
};
