import java.io.File;
import java.util.HashMap;
import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.util.ArrayList;
import java.util.List;

public class FileManagerGUI {

  private final FileManagerLogic fileManager;
  private final JFrame frame;
  private final JTextField commandField;
  private final JList<String> fileList;
  private final DefaultListModel<String> listModel;
  private final JLabel currentPathLabel;
  private boolean ctrlPressed;
  private List<String> selectedFiles;

  public FileManagerGUI() {
    fileManager = new FileManagerLogic();
    listModel = new DefaultListModel<>();
    fileList = new JList<>(listModel);
    ImageIcon folderIcon = resizeIcon(new ImageIcon("folder.png"));
    fileList.setCellRenderer(new FileListCellRenderer(folderIcon));

    frame = new JFrame("File Manager");
    frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
    frame.setSize(800, 600);
    frame.setLocation(350, 100);

    JTextArea textArea = new JTextArea();
    textArea.setEditable(false);

    commandField = new JTextField();
    commandField.addActionListener(e -> {
      executeCommand(commandField.getText());
      commandField.setText("");
    });

    currentPathLabel = new JLabel();
    updateCurrentPathLabel();

    JButton helpButton = new JButton("Help");
    helpButton.addActionListener(e -> printHelp());

    JButton backButton = new JButton("Back");
    backButton.addActionListener(e -> {
      fileManager.goBack();
      refreshFileList();
    });

    JScrollPane fileListScrollPane = new JScrollPane(fileList);
    fileList.setSelectionMode(ListSelectionModel.MULTIPLE_INTERVAL_SELECTION);

    // Добавление слушателя для ПКМ
    fileList.addMouseListener(new MouseAdapter() {
      @Override
      public void mouseClicked(MouseEvent e) {
        if (SwingUtilities.isRightMouseButton(e) && e.getClickCount() == 1) {
          int index = fileList.locationToIndex(e.getPoint());
          fileList.setSelectedIndex(index); // Выбор файла ПКМ
          showRenameDialog();
        }
        if (e.getClickCount() == 2) {
          int index = fileList.locationToIndex(e.getPoint());
          String selectedFile = listModel.get(index);
          if (selectedFile.endsWith("(directory)")) {
            String directoryName = selectedFile.substring(1, selectedFile.length() - 12);
            fileManager.changeDirectory(directoryName);
            refreshFileList();
          }
        }
      }
    });

    fileList.addKeyListener(new KeyAdapter() {
      @Override
      public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_CONTROL) {
          ctrlPressed = true;
        }
      }

      @Override
      public void keyReleased(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_CONTROL) {
          ctrlPressed = false;
        }
      }
    });

    fileList.addMouseListener(new MouseAdapter() {
      @Override
      public void mousePressed(MouseEvent e) {
        int index = fileList.locationToIndex(e.getPoint());
        if (ctrlPressed) {
          String selectedFile = listModel.get(index);
          if (selectedFiles == null) {
            selectedFiles = new ArrayList<>();
          }
          if (!selectedFiles.contains(selectedFile)) {
            selectedFiles.add(selectedFile);
          }
        }
      }
    });

    JPopupMenu popupMenu = new JPopupMenu();
    JMenuItem renameItem = new JMenuItem("Rename");
    renameItem.addActionListener(e -> {
      if (selectedFiles != null) {
        showRenameDialog();
      }
    });
    popupMenu.add(renameItem);

    fileList.setComponentPopupMenu(popupMenu);

    JButton renameButton = new JButton("Rename");
    renameButton.addActionListener(e -> {
      if (selectedFiles != null) {
        showRenameDialog();
      }
    });

    JPanel buttonPanel = new JPanel();
    buttonPanel.setLayout(new FlowLayout());
    buttonPanel.add(helpButton);
    buttonPanel.add(backButton);
    buttonPanel.add(renameButton);

    JPanel mainPanel = new JPanel();
    mainPanel.setLayout(new BorderLayout());
    mainPanel.add(new JScrollPane(textArea), BorderLayout.CENTER);
    mainPanel.add(commandField, BorderLayout.SOUTH);
    mainPanel.add(buttonPanel, BorderLayout.NORTH);
    mainPanel.add(fileListScrollPane, BorderLayout.CENTER);
    mainPanel.add(currentPathLabel, BorderLayout.SOUTH);

    frame.add(mainPanel);
    frame.setVisible(true);

    refreshFileList();
  }

  private ImageIcon resizeIcon(ImageIcon icon) {
    Image image = icon.getImage();
    Image newImage = image.getScaledInstance(16, 16, Image.SCALE_SMOOTH);
    return new ImageIcon(newImage);
  }

  private void showRenameDialog() {
    JDialog dialog = new JDialog(frame, "Rename File(s)", true);
    dialog.setModalityType(Dialog.ModalityType.APPLICATION_MODAL);
    dialog.setSize(300, 120);
    dialog.setLayout(new FlowLayout());

    JTextField renameField = new JTextField(20);
    JButton renameButton = new JButton("Rename");

    renameButton.addActionListener(e -> {
      String newName = renameField.getText();
      for (int index : fileList.getSelectedIndices()) {
        String selectedFile = listModel.get(index);
        if (selectedFile.endsWith("(directory)")) {
          continue;
        }
        String currentName = getCurrentName(selectedFile);
        String newPath = getNewPath(currentName, newName, selectedFile);
        fileManager.renameFileName(currentName, newPath);
      }
      dialog.dispose();
      refreshFileList();
      selectedFiles = null;
    });

    dialog.add(renameField);
    dialog.add(renameButton);
    dialog.setVisible(true);
  }

  private String getCurrentName(String selectedFile) {
    if (selectedFile.endsWith("(directory)")) {
      return selectedFile.substring(1, selectedFile.length() - 12);
    } else {
      int extensionIndex = selectedFile.lastIndexOf(' ');
      if (extensionIndex != -1) {
        return selectedFile.substring(0, extensionIndex);
      } else {
        return selectedFile;
      }
    }
  }

  private String getNewPath(String currentName, String newName, String selectedFile) {
    String extension = selectedFile.endsWith("(directory)") ? "(directory)" : "";
    return currentName + " (" + newName + ")" + extension;
  }

  private void refreshFileList() {
    listModel.clear();
    String[] files = fileManager.listFiles().split("\n");

    for (String file : files) {
      if (file.endsWith("(directory)")) {
        listModel.addElement(" " + file);
      } else {
        listModel.addElement(file);
      }
    }

    updateCurrentPathLabel();
  }

  private void updateCurrentPathLabel() {
    File currentDirectory = new File(fileManager.getCurrentDirectory());
    String currentPath = currentDirectory.getAbsolutePath();
    currentPathLabel.setText(currentPath);
  }

  private void executeCommand(String command) {
    String[] parts = command.split(" ");

    HashMap<String, Runnable> commandMap = new HashMap<>();
    commandMap.put("cd", () -> {
      if (parts.length == 2) {
        fileManager.changeDirectory(parts[1]);
        refreshFileList();
      }
    });
    commandMap.put("rename", () -> {
      if (parts.length == 3) {
        fileManager.renameFileName(parts[1], parts[2]);
        refreshFileList();
      }
    });
    commandMap.put("rename_all", () -> {
      if (parts.length == 3) {
        fileManager.renameAllFileNames(parts[1].replace("*", ""), parts[2]);
        refreshFileList();
      }
    });
    commandMap.put("help", this::printHelp);
    commandMap.put("dir", this::refreshFileList);

    Runnable commandAction = commandMap.get(command);
    if (commandAction != null) {
      commandAction.run();
    }
  }

  private void printHelp() {
    String helpMessage = """
        Available commands:
        cd "path" - Change to a different directory.
        rename "path" "new_name" - Change the name of a specific file.
        rename_all "extension" "new_name" - Change the names of groups of files in the current directory.
        """;

    JTextArea helpTextArea = new JTextArea(helpMessage);
    helpTextArea.setEditable(false);
    JScrollPane scrollPane = new JScrollPane(helpTextArea);

    JDialog helpDialog = new JDialog(frame, "Help", true);
    helpDialog.setLocation(500, 250);
    helpDialog.setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE);
    helpDialog.add(scrollPane);
    helpDialog.pack();
    helpDialog.setVisible(true);
  }

  public static void main(String[] args) {
    SwingUtilities.invokeLater(FileManagerGUI::new);
  }
}
