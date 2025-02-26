import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { ChevronsDown, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { UploadedImages } from "./uploaded-images";
import { Button } from "../ui/button";
import chevronleft from "@img/icons/chevron-left.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  groupid: string;
};

const MAX_FILES = 5;

export function GroupPhotoSection({ groupid }: Props) {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: unknown) => {
      return await _axios.post("group/upload-images", data);
    },
    onSuccess(data) {
      if (data.data.ok) {
        toast(data.data.message || "Image Added successfully");
        queryClient.invalidateQueries({
          queryKey: ["uploaded-images", groupid],
        });
        setUploadedFiles([]);
      } else {
        toast(data.data.message || "An error occurred while creating post");
      }
    },
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (uploadedFiles.length + files.length > MAX_FILES) {
      return toast.success(`You can upload a maximum of ${MAX_FILES} images.`);
    }

    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleSumbit = () => {
    const formData = new FormData();

    if (uploadedFiles.length === 0) {
      return toast.success("Please select a file to upload");
    }

    if (uploadedFiles.length > 0) {
      for (let file of uploadedFiles) {
        formData.append("file", file);
      }
    }
    formData.append("groupId", groupid);
    mutate(formData);
  };

  return (
    <>
      <div>
        <input
          type='file'
          accept='image/*'
          className='hidden'
          multiple
          onChange={handleFileUpload}
          ref={fileInputRef}
        />
        <div onClick={() => fileInputRef.current?.click()}>
          <Label htmlFor='file'></Label>
          <div className='h-[80px] text-fadedtext cursor-pointer border rounded-xl text-lg flex justify-start p-4 items-center'>
            <h4>Upload an image</h4>
          </div>
        </div>

        <div className='grid  grid-cols-2  lg:grid-cols-4 xl:grid-cols-5 gap-4 my-4'>
          {uploadedFiles.map((file, index) => (
            <div className='relative border-2 rounded-md p-3' key={index}>
              <Trash2
                className='absolute top-4 right-4 cursor-pointer text-red'
                color='red'
                onClick={() => {
                  setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
                }}
              />
              <Image
                src={URL.createObjectURL(file)}
                alt=''
                width={30}
                height={100}
                className='w-full h-[200px] object-cover rounded-2xl'
              />
            </div>
          ))}
        </div>
        <div className='flex justify-end'>
          <Button
            onClick={() => handleSumbit()}
            className='rounded-full py-[25px] w-[130px] bg-buttoncol text-white flex justify-between font-bold shadow-none text-sm hover:bg-buttoncol'
            type='submit'
            disabled={isPending}>
            Update
            <Image src={chevronleft} alt='chevron-left' />
          </Button>
        </div>
      </div>
      <UploadedImages groupid={groupid} />
    </>
  );
}
