import java.awt.Component;
import javax.swing.DefaultListCellRenderer;
import javax.swing.ImageIcon;
import javax.swing.JLabel;
import javax.swing.JList;

class FileListCellRenderer extends DefaultListCellRenderer {

  private final ImageIcon folderIcon;

  public FileListCellRenderer(ImageIcon folderIcon) {
    this.folderIcon = folderIcon;
  }

  @Override
  public Component getListCellRendererComponent(
      JList<?> list,
      Object value,
      int index,
      boolean isSelected,
      boolean cellHasFocus
  ) {
    JLabel label = (JLabel) super.getListCellRendererComponent(list, value, index, isSelected, cellHasFocus);

    if (value instanceof String fileName) {
      if (fileName.endsWith("(directory)")) {
        label.setIcon(folderIcon);
        label.setText(fileName.substring(1, fileName.length() - 12));
      } else {
        label.setIcon(null);
      }
    }

    return label;
  }
}
