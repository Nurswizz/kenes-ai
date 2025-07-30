interface SuggestionProps {
  suggestion: string;
  setValue: (value: string) => void;
}

const Suggestion = ({ suggestion, setValue }: SuggestionProps) => {
  const handleClick = () => {
    setValue(suggestion);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-navbar cursor-pointer rounded-md px-3 py-2 shadow pointer-events-auto text-sm sm:text-base break-words max-w-full sm:max-w-64 transition-colors hover:bg-darkerNavbar"
    >
      {suggestion}
    </div>
  );
};


export default Suggestion;
