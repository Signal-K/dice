interface SessionIdDisplayProps {
    sessionId: string | null;
};
  
const SessionIdDisplay: React.FC<SessionIdDisplayProps> = ({ sessionId }) => {
    if (!sessionId) return null;

    return (
        <div className="absolute top-20 left-0 transform rotate-45 origin-top-left bg-blue-500 text-white px-4 py-2 w-auto">
            <span className="text-sm">Session ID: {sessionId}</span>
        </div>
    );
};  

export default SessionIdDisplay;