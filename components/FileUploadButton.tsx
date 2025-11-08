"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, File, X } from "lucide-react"

interface FileUploadButtonProps {
  onFileSelect?: (file: File) => void
  accept?: string
  className?: string
}

export default function FileUploadButton({
  onFileSelect,
  accept = "*/*",
  className = "",
}: FileUploadButtonProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      onFileSelect?.(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <Button
        onClick={handleButtonClick}
        variant="outline"
        className="w-full sm:w-auto"
      >
        <Upload className="h-4 w-4" />
        {selectedFile ? "Change File" : "Upload File"}
      </Button>

      {selectedFile && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border border-border">
          <File className="h-4 w-4 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemoveFile}
            className="h-8 w-8 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

