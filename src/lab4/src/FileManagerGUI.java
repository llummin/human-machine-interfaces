import java.awt.BorderLayout;
import java.awt.Dialog;
import java.awt.FlowLayout;
import java.awt.Image;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import javax.swing.DefaultListModel;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JMenuItem;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JPopupMenu;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.ListSelectionModel;
import javax.swing.SwingUtilities;
import javax.swing.WindowConstants;

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
    commandField.addActionListener(e -> commandField.setText(""));

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
    JTextField extensionField = new JTextField(5); // Added extension input field
    JButton renameButton = new JButton("Rename");

    renameButton.addActionListener(e -> {
      String newName = renameField.getText();
      String extension = extensionField.getText();
      if (!newName.isEmpty()) {
        renameSelectedFiles(newName, extension);
        dialog.dispose();
        refreshFileList();
        selectedFiles = null;
      }
    });

    dialog.add(renameField);
    dialog.add(new JLabel("."));
    dialog.add(extensionField);
    dialog.add(renameButton);
    dialog.setVisible(true);
  }

  private void renameSelectedFiles(String newName, String extension) {
    int count = 0;
    for (int index : fileList.getSelectedIndices()) {
      String selectedFile = listModel.get(index);
      if (selectedFile.endsWith("(directory)")) {
        continue;
      }
      String currentName = getCurrentName(selectedFile);
      if (extension.isEmpty()) {
        showErrorDialog();
        return;
      }
      String newPath = newName + (count > 0 ? " (" + count + ")" : "") + "." + extension;
      fileManager.renameFileName(currentName, newPath);
      count++;
    }
  }

  private void showErrorDialog() {
    JOptionPane.showMessageDialog(frame, "Please provide a file extension.", "Error", JOptionPane.ERROR_MESSAGE);
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


  private void printHelp() {
    String helpMessage = """
        Здравствуйте!
        - Чтобы вернуться назад, вам необходимо нажать кнопку "Back".
        - Чтобы изменить файл, вам необходимо выполнить следующие действия:
            1. Нажать на файл при помощи ЛКМ.
            2. Зажать клавишу Ctrl.
            3. Нажать на файл при помощи ПКМ.
            4. Нажать на всплывающую клавишу "Rename".
            5. Введите новое имя файла.
        - Чтобы изменить группу файлов, вам необходимо выполнить следующие действия:
            1. Выберите файлы для изменения с зажатой клавишей Ctrl, используя ЛКМ.
            2. Нажать на всплывающую клавишу "Rename".
            3. Введите новое имя файлов.
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
