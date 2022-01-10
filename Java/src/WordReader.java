import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class WordReader {
    public static void main(String[] args) throws FileNotFoundException {
        String localDir = System.getProperty("user.dir");
        System.out.println(localDir);
        String path = localDir + File.separator + "words.txt";

        InputStream is = new FileInputStream(path);

        try (Scanner sc = new Scanner(
                is, StandardCharsets.UTF_8.name())) {
            System.out.println("words=[");
            while (sc.hasNextLine()) {
                String text = sc.nextLine();
                if(text.matches("^[a-zA-Z]{5}$")){
                    System.out.println("\"" + text "\"" + ",");
                }
            }
            System.out.println("]");
            // make sure to remove the last ',' to complete the array for json.
        }
    }
}
