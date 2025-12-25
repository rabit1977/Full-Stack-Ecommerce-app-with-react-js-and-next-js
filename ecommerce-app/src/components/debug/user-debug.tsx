'use client';

import { useAppSelector } from "@/lib/store/hooks";

export const UserDebug = () => {
  const { users } = useAppSelector((state) => state.user);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 9999,
        maxWidth: '90vw',
        maxHeight: '30vh',
        overflow: 'auto',
        fontSize: '12px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
      }}
    >
      <h3 style={{ marginTop: 0, fontWeight: 'bold' }}>User Debug:</h3>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
};
