import javax.swing.*;
import java.awt.*;

public class FileManagerGUI {

  private final FileManagerLogic fileManager;
  private final JTextArea textArea;
  private final JTextField commandField;

  public FileManagerGUI() {
    fileManager = new FileManagerLogic();

    JFrame frame = new JFrame("File Manager");
    frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
    frame.setSize(400, 300);

    textArea = new JTextArea();
    textArea.setEditable(false);

    commandField = new JTextField();
    commandField.addActionListener(e -> {
      executeCommand(commandField.getText());
      commandField.setText("");
    });

    JPanel buttonPanel = new JPanel();
    buttonPanel.setLayout(new FlowLayout());

    JPanel mainPanel = new JPanel();
    mainPanel.setLayout(new BorderLayout());
    mainPanel.add(new JScrollPane(textArea), BorderLayout.CENTER);
    mainPanel.add(commandField, BorderLayout.SOUTH);
    mainPanel.add(buttonPanel, BorderLayout.NORTH);

    frame.add(mainPanel);
    frame.setVisible(true);
  }

  private void executeCommand(String command) {
    String[] parts = command.split(" ");
    String cmd = parts[0].toLowerCase();

    switch (cmd) {
      case "cd" -> {
        if (parts.length == 2) {
          fileManager.changeDirectory(parts[1]);
        } else {
          textArea.append("Incorrect number of arguments. Use 'cd \"path\"'.\n");
        }
      }
      case "back" -> fileManager.goBack();
      case "rename" -> {
        if (parts.length == 3) {
          textArea.append(fileManager.renameFileName(parts[1], parts[2]) + "\n");
        } else {
          textArea.append("Incorrect number of arguments. Use 'rename \"path\" \"new_name\"'.\n");
        }
      }
      case "rename_all" -> {
        if (parts.length == 3) {
          textArea.append(fileManager.renameAllFileNames(parts[1], parts[2]) + "\n");
        } else {
          textArea.append(
              "Incorrect number of arguments. Use 'rename_all \"extension\" \"new_name\"'.\n");
        }
      }
      case "help" -> printHelp();
      case "dir" -> textArea.append(fileManager.listFiles());
      default -> textArea.append("Unknown command. Enter 'help' for assistance.\n");
    }
  }

  private void printHelp() {
    textArea.append("Available commands:\n");
    textArea.append("cd \"path\" - Change to a different directory.\n");
    textArea.append("back - Go to the parent directory.\n");
    textArea.append("rename \"path\" \"new_name\" - Change the name of a specific file.\n");
    textArea.append(
        "rename_all \"extension\" \"new_name\" - Change the names of groups of files in the current directory.\n");
    textArea.append("dir - List all files in the directory.\n");
    textArea.append("exit - Exit the application.\n");
  }

  public static void main(String[] args) {
    SwingUtilities.invokeLater(FileManagerGUI::new);
  }
}
