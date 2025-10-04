import * as React from "react";
import Tiles from "./components/Tiles.tsx";


const MedicineRequest: React.FC = () => {


    return (
        <div className={"h-screen w-screen bg-white flex flex-col items-stretch justify-items-stretch"}>
            <Tiles></Tiles>
        </div>
    );
};

export default MedicineRequest;