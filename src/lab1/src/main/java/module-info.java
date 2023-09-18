module com.llummin.lab1 {
  requires javafx.controls;
  requires javafx.fxml;

  requires org.kordamp.bootstrapfx.core;

  opens com.llummin.lab1 to javafx.fxml;
  exports com.llummin.lab1;
}