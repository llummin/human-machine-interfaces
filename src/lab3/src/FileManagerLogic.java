import java.io.File;

public class FileManagerLogic {

  private File currentDirectory;

  public FileManagerLogic() {
    currentDirectory = new File(System.getProperty("user.dir"));
  }

  public void changeDirectory(String newPath) {
    File newDir = new File(currentDirectory, newPath);
    if (newDir.exists() && newDir.isDirectory()) {
      currentDirectory = newDir;
    }
  }

  public void goBack() {
    File parentDirectory = currentDirectory.getParentFile();
    if (parentDirectory != null && parentDirectory.isDirectory()) {
      currentDirectory = parentDirectory;
    }
  }

  public String renameFileName(String filePath, String newName) {
    File fileToRename = new File(currentDirectory, filePath);
    if (fileToRename.exists()) {
      File newFile = new File(fileToRename.getParentFile(), newName);
      if (fileToRename.renameTo(newFile)) {
        return "File name changed successfully.";
      } else {
        return "Failed to change file name.";
      }
    } else {
      return "File not found.";
    }
  }

  public String renameAllFileNames(String extension, String newName) {
    String extensionWithoutWildcard = extension.replace("*", "");
    File[] files = currentDirectory.listFiles();

    if (files == null) {
      return "Error reading files in the current directory.";
    }

    boolean filesRenamed = isFilesRenamed(files, extensionWithoutWildcard, newName);

    if (filesRenamed) {
      return "File names successfully renamed.";
    } else {
      return "Files with extension " + extensionWithoutWildcard + " not found.";
    }
  }

  private boolean isFilesRenamed(File[] files, String extension, String newName) {
    int count = 1;
    boolean filesRenamed = false;

    for (File file : files) {
      if (file.isFile() && file.getName().endsWith(extension)) {
        String oldName = file.getName();
        int extensionIndex = oldName.lastIndexOf(".");

        if (extensionIndex != -1) {
          String fileExtension = oldName.substring(extensionIndex);
          String newFileName = newName + " (" + count + ")" + fileExtension;
          File newFile = new File(file.getParentFile(), newFileName);

          if (file.renameTo(newFile)) {
            count++;
            filesRenamed = true;
          }
        }
      }
    }

    return filesRenamed;
  }

  public String listFiles() {
    StringBuilder fileNames = new StringBuilder();
    File[] files = currentDirectory.listFiles();
    if (files != null) {
      for (File file : files) {
        if (file.isFile()) {
          fileNames.append(file.getName()).append("\n");
        } else if (file.isDirectory()) {
          fileNames.append(file.getName()).append(" (directory)\n");
        }
      }
    } else {
      return "Error reading files in the current directory.";
    }
    return fileNames.toString();
  }

  public String getCurrentDirectory() {
    return currentDirectory.getAbsolutePath();
  }
}
