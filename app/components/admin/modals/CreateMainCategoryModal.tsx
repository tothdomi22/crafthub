import React, {FormEvent, useState} from "react";
import useCreateMainCategory from "@/app/hooks/admin/main-category/useCreateMainCategory";
import {useQueryClient} from "@tanstack/react-query";

export default function CreateMainCategoryModal({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const [uniqueName, setUniqueName] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const queryClient = useQueryClient();

  const {mutate: createMainCategoryMutation} = useCreateMainCategory();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = {uniqueName, displayName, description};

    createMainCategoryMutation(data, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({queryKey: ["mainCategories"]});
        closeModal();
        setUniqueName("");
        setDisplayName("");
        setDescription("");
      },
    });
  };

  return (
    <div className="absolute inset-0 flex items-center z-50 justify-center bg-black/40">
      <div className="bg-white w-[300px] h-[300px] relative">
        <button onClick={closeModal} className="absolute right-[0px] p-2">
          X
        </button>
        <p>Create main category</p>
        <form onSubmit={handleSubmit}>
          <input
            id="unique-name-input"
            className={`h-full w-full focus:outline-none px-2`}
            type="text"
            placeholder="Enter a unique name"
            value={uniqueName}
            onChange={e => {
              setUniqueName(e.target.value);
            }}
          />
          <input
            id="display-name-input"
            className={`h-full w-full focus:outline-none px-2`}
            type="text"
            placeholder="Enter a display name"
            value={displayName}
            onChange={e => {
              setDisplayName(e.target.value);
            }}
          />
          <input
            id="description-input"
            className={`h-full w-full focus:outline-none px-2`}
            type="text"
            placeholder="Enter a description"
            value={description}
            onChange={e => {
              setDescription(e.target.value);
            }}
          />
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
}
