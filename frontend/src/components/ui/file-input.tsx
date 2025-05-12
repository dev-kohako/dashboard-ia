import React from "react";

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  noFileText?: string;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ label = "Upload Arquivo", noFileText = "Nenhum arquivo selecionado", ...props }, ref) => {
    const [fileName, setFileName] = React.useState("");

    return (
      <div className="flex items-center gap-2">
        <label className="px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90">
          {label}
          <input
            type="file"
            ref={ref}
            {...props}
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
          />
        </label>
        <span className="text-sm text-muted-foreground">
          {fileName || noFileText}
        </span>
      </div>
    );
  }
);

FileInput.displayName = "FileInput";

export { FileInput };