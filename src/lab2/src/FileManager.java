import java.io.File;
import java.util.Scanner;

public class FileManager {

  private static File currentDirectory;

  private static void changeDirectory(String[] parts) {
    if (parts.length != 2) {
      System.out.println("Incorrect number of arguments. Use 'cd \"path\"'.");
      return;
    }
    String newPath = parts[1];
    File newDir = new File(currentDirectory, newPath);
    if (newDir.exists() && newDir.isDirectory()) {
      currentDirectory = newDir;
    } else {
      System.out.println("Directory not found.");
    }
  }

  private static void goBack() {
    File parentDirectory = currentDirectory.getParentFile();
    if (parentDirectory != null && parentDirectory.isDirectory()) {
      currentDirectory = parentDirectory;
    } else {
      System.out.println("No parent directory.");
    }
  }

  private static void renameFileName(String[] parts) {
    if (parts.length != 3) {
      System.out.println("Incorrect number of arguments. Use 'rename \"path\" \"new_name\"'.");
      return;
    }
    String filePath = parts[1];
    String newName = parts[2];
    File fileToRename = new File(currentDirectory, filePath);
    if (fileToRename.exists()) {
      File newFile = new File(fileToRename.getParentFile(), newName);
      if (fileToRename.renameTo(newFile)) {
        System.out.println("File name changed successfully.");
      } else {
        System.out.println("Failed to change file name.");
      }
    } else {
      System.out.println("File not found.");
    }
  }

  private static void renameAllFileNames(String[] parts) {
    if (parts.length != 3) {
      System.out.println(
          "Incorrect number of arguments. Use 'rename_all \"extension\" \"new_name\"'.");
      return;
    }
    String extension = parts[1].replace("*", "");
    String newName = parts[2];
    File[] files = currentDirectory.listFiles();
    if (files != null) {
      boolean filesRenamed = isFilesRenamed(files, extension, newName);
      if (filesRenamed) {
        System.out.println("File names successfully renamed.");
      } else {
        System.out.println("Files with extension " + extension + " not found.");
      }
    } else {
      System.out.println("Error reading files in the current directory.");
    }
  }

  private static boolean isFilesRenamed(File[] files, String extension, String newName) {
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


  private static void printHelp() {
    System.out.println("Available commands:");
    System.out.println("cd \"path\" - Change to a different directory.");
    System.out.println("back - Go to the parent directory.");
    System.out.println("rename \"path\" \"new_name\" - Change the name of a specific file.");
    System.out.println(
        "rename_all \"extension\" \"new_name\" - Change the names of groups of files in the current directory.");
    System.out.println("dir - List all files in the directory.");
    System.out.println("exit - Exit the application.");
  }

  private static void listFiles() {
    File[] files = currentDirectory.listFiles();
    if (files != null) {
      for (File file : files) {
        if (file.isFile()) {
          String fileName = file.getName();
          System.out.println(fileName);
        } else if (file.isDirectory()) {
          String directoryName = file.getName();
          System.out.println("[" + directoryName + "] (directory)");
        }
      }
    } else {
      System.out.println("Error reading files in the current directory.");
    }
  }

  private static void executeCommand(String command) {
    String[] parts = command.split(" ");
    String cmd = parts[0].toLowerCase();

    switch (cmd) {
      case "cd" -> changeDirectory(parts);
      case "back" -> goBack();
      case "rename" -> renameFileName(parts);
      case "rename_all" -> renameAllFileNames(parts);
      case "help" -> printHelp();
      case "dir" -> listFiles();
      case "exit" -> System.exit(0);
      default -> System.out.println("Unknown command. Enter 'help' for assistance.");
    }
  }

  public static void main(String[] args) {
    currentDirectory = new File(System.getProperty("user.dir"));
    Scanner scanner = new Scanner(System.in);

    System.out.println("Welcome to the file manager! Enter 'help' for assistance.");

    boolean running = true;
    while (running) {
      System.out.print(currentDirectory.getAbsolutePath() + "> ");
      String command = scanner.nextLine().trim();
      if (command.equalsIgnoreCase("exit")) {
        running = false;
      } else {
        executeCommand(command);
      }
    }
  }
}
