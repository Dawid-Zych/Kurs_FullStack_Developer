import * as fs from 'fs';

/*  funkcja processPropsForTemplate służy do przetwarzania właściwości propsForTemplate 
i zastępowania ich wartości w podanym szablonie template. Funkcja zwraca zaktualizowany szablon. */
function processPropsForTemplate(propsForTemplate, template) {
	if (!propsForTemplate) return template;
	// Sprawdza, czy propsForTemplate nie jest null lub undefined. Jeśli tak, zwraca niezmieniony szablon template.

	for (let [key, value] of Object.entries(propsForTemplate)) {
		key = `{{${key}}}`; // Tworzy nowy klucz key w formacie {{key}}, który będzie używany do zastąpienia w szablonie.
		template = template.replaceAll(key, value);
		//Zastępuje wszystkie wystąpienia klucza key w szablonie template wartością value. Metoda replaceAll() zamienia wszystkie wystąpienia określonego ciągu znaków na inny ciąg znaków.
	}

	return template;
	//Zwraca zaktualizowany szablon po przetworzeniu właściwości propsForTemplate.
}

/* funkcja render służy do renderowania szablonu HTML na podstawie ścieżki do pliku,
 odpowiedzi HTTP i właściwości propsForTemplate. Funkcja odczytuje zawartość pliku, 
 przetwarza właściwości w szablonie i wysyła go jako odpowiedź. */
export function render(path, response, propsForTemplate) {
	//przyjmuje trzy parametry: path (ścieżka do pliku), response (obiekt odpowiedzi HTTP) i propsForTemplate (właściwości do przetworzenia w szablonie).
	try {
		const data = fs.readFileSync(path, 'utf8');
		//Odczytuje zawartość pliku o podanej ścieżce synchronicznie za pomocą fs.readFileSync(). Zawartość pliku jest przechowywana w zmiennej data. Używany jest kodowanie 'utf8' do odczytu pliku jako tekst.

		const modifiedTemplate = processPropsForTemplate(propsForTemplate, data);
		//Wywołuje funkcję processPropsForTemplate do przetworzenia właściwości propsForTemplate w szablonie data. Zaktualizowany szablon jest przechowywany w zmiennej modifiedTemplate.

		response.write(modifiedTemplate);
		// Wysyła zaktualizowany szablon jako treść odpowiedzi HTTP za pomocą metody response.write().
	} catch (error) {
		response.writeHead(404);
		response.write('File not found');
	}
}

/*Ta funkcja tasksListHtml służy do generowania listy zadań w formacie HTML
 na podstawie przekazanej tablicy zadań tasks. Funkcja zwraca wygenerowany kod HTML.  */

export function tasksListHtml(tasks) {
	//Deklaruje funkcję tasksListHtml, która przyjmuje parametr tasks (tablica zadań).

	if (!tasks) return 'Error: No task for template';
	//Sprawdza, czy tasks jest fałszywe (null, undefined, pusta tablica). Jeśli tak, zwraca komunikat błędu "Error: No task for template".

	let html = '';
	for (const task of tasks) {
		console.log(task.title);
		//wyświetla tytuł zadania w konsoli. Ta linia kodu może służyć do celów diagnostycznych i może zostać usunięta, jeśli nie jest potrzebna.
		html += task.title + '<br>';
	}
	return html;
}
