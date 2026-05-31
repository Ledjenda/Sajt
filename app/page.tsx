import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <img src="/assets/shop-hero.png" alt="Farbara sa policama boja i alata" />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow">Maloprodaja i veleprodaja</p>
          <h1>DIM TEAM</h1>
          <p>Boje, lakovi, fasade, auto program, gipsani program i alat za majstore, firme i kucne kupce.</p>
          <div className="actions">
            <Link className="button primary" href="/proizvodi">Pogledaj proizvode</Link>
            <Link className="button secondary light" href="/login">Veleprodajni login</Link>
          </div>
        </div>
      </section>
      <section className="home-band">
        <div><p className="eyebrow">Sve na jednom mestu</p><h2>Za kucu, radionicu i gradiliste</h2><p>Maloprodajni kupci kupuju bez prijave. Veleprodajni kupci nakon prijave vide svoje cene, fakture i kredit.</p></div>
        <div className="quick-links">
          <Link href="/proizvodi"><strong>Proizvodi</strong><span>Pregledajte katalog</span></Link>
          <Link href="/login"><strong>Veleprodaja</strong><span>Prijavite se za B2B cene</span></Link>
          <Link href="/podrska"><strong>Podrska</strong><span>Posaljite poruku nasem timu</span></Link>
        </div>
      </section>
    </main>
  );
}
