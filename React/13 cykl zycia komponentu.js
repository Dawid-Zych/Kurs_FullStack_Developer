/*
        Cykl życia komponentów można podzielić na 3 fazy:
        - mounting - montowanie czyli wstawianie komponentu do drzewa DOM
        - update - aktualizacja komponentu jeśli zmieni się stan albo props
        - unmount - demontowanie komponentu, czyli usuwanie z drzewa DOM

        Każda z faz ma różne funkcje, które w większości są opcjonalne do wykorzystania.

        -----------------------------------------------------------------------

        Montowanie można podzielić na 4 fazy:
        - constructor() - wywołany gdy komponent jest zainicjalizowany, tutaj 
            ustawiane są początkowe wartości state, również przyjmuje obiekt 
            props z przekazanymi argumentami.  W przypadku props zawsze trzeba 
            wywołać konstruktor rodzica super(props);. Konstruktor Opcjonalny.

        - getDerivedStateFromProps(props, state) - wywołana przed renderowaniem 
          komponentu, rzadko używana, można zmienić tutaj state na podstawie 
          props i zwrócić co wpłynie na renderowanie.

        - render() - obowiązkowa metoda, renderuje komponent, dodaje go do 
                     drzewa DOM

        - componentDidMount() - komponent jest już w drzewie DOM, można tutaj 
                                modyfikować DOM

    */

/*
   
        Update - aktualizacja komponentu jeśli zmieni się state lub props,
        proces ten można podzielić na 5 faz: 
        - getDerivedStateFromProps(props, state) - wywołana jako pierwsza w fazie 
          update przed renderowaniem komponentu, rzadko  używana, można zmienić 
          tutaj state na podstawie props i zwrócić go co wpłynie na renderowanie.
        - shouldComponentUpdate() - funkcja określa czy komponent ma być 
          renderowany, domyślnie zwraca true.
        - render() - obowiązkowa metoda, renderuje komponent, dodaje go do DOM
        - getSnapshotBeforeUpdate(prevProps, prevState) - pozwala na dostęp do 
          poprzedniej wersji props i state, która była przed update, ale po 
          wykonanym update. Jeśli jest w komponencie to również musi być 
          obecna funkcja componentDidUpdate(), inaczej będzie błąd.
        - componentDidUpdate() - funkcja wywoływana gdy komponent został 
          zaktualizowany w drzewie DOM.
    */

/*
        unmount - demontowanie komponentu, czyli usuwanie z drzewa DOM
        Dostępna w tej fazie jest jedna funkcja:
        componentWillUnmount() - wywołana w momencie odmontowania 
                                 komponentu, przydatne aby zakończyć np 
                                 jakąś funkcję działającą w tle jak timer itd.
    */
