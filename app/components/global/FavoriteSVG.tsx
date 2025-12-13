import React from "react";

interface FavoriteSVGProps extends React.SVGProps<SVGSVGElement> {
  filled: boolean;
}

const FavoriteSVG: React.FC<FavoriteSVGProps> = ({filled, ...props}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentColor"
      {...props}>
      {filled ? (
        // Solid Heart (Filled)
        <path d="m480-120-58-52q-101-91-166.5-157T153-440q-37-45-54-82.5T82-612q0-94 65-159t159-65q64 0 114.5 33.5T480-713q41-57 91.5-90.5T686-836q94 0 159 65t65 159q0 45-17 82.5T839-440q-36 60-101.5 126T538-172l-58 52Z" />
      ) : (
        // Outlined Heart (Hollow)
        <path d="m480-144-50-45q-100-89-165-152.5t-102.5-113Q125-504 110.5-545T96-629q0-89 61-150t150-61q49 0 95 21t78 59q32-38 78-59t95-21q89 0 150 61t61 150q0 43-14 83t-51.5 89q-37.5 49-103 113.5T528-187l-48 43Zm0-97q93-83 153-141.5t95.5-102Q764-528 778-562t14-67q0-59-40-99t-99-40q-35 0-65.5 14.5T535-713l-35 41h-40l-35-41q-22-26-53.5-40.5T307-768q-59 0-99 40t-40 99q0 33 13 65.5t47.5 75.5q34.5 43 95 102T480-241Zm0-264Z" />
      )}
    </svg>
  );
};

export default FavoriteSVG;
