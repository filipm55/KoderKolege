class TempClass2 {
public static void main(String[] args) {
        // Stvaranje objekta za unos sa tastature
        Scanner scanner = new Scanner(System.in);

        // Unos cijelog broja
        System.out.print("Unesite cijeli broj: ");
        int broj = scanner.nextInt();

        // Pronalaženje najmanje znamenke
        int najmanjaZnamenka = pronadiNajmanjuZnamenku(broj);

        // Ispis rezultata
        System.out.println("Najmanja znamenka broja " + broj + " je: " + najmanjaZnamenka);

        // Zatvaranje Scanner objekta (dobro praksa)
        scanner.close();
    }

    // Metoda koja pronalazi najmanju znamenku u cijelom broju
    private static int pronadiNajmanjuZnamenku(int broj) {
        // Inicijalizacija s prve znamenke
        int najmanjaZnamenka = broj % 10;

        // Iteracija kroz ostale znamenke
        while (broj != 0) {
            int trenutnaZnamenka = broj % 10;
            if (trenutnaZnamenka < najmanjaZnamenka) {
                najmanjaZnamenka = trenutnaZnamenka;
            }
            broj /= 10; // Pomak na sljede?u znamenku
        }

        return najmanjaZnamenka;
    }

}