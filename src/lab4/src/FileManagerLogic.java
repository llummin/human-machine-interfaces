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

  public void renameFileName(String filePath, String newName) {
    File fileToRename = new File(currentDirectory, filePath);
    if (fileToRename.exists()) {
      String newFilePath = fileToRename.getParent() + File.separator + newName;
      File newFile = new File(newFilePath);

      if (fileToRename.renameTo(newFile)) {
        System.out.println("File renamed successfully.");
      } else {
        System.out.println("Error renaming the file.");
      }
    } else {
      System.out.println("File not found.");
    }
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
