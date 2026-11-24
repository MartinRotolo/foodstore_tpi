from sqlmodel import Session, select

from app.core.database import create_all_tables, engine
from app.core.security import hash_password
from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto
from app.modules.usuarios.models import Usuario

ADMIN = {
    "username": "admin",
    "full_name": "Administrador Food Store",
    "email": "admin@foodstore.com",
    "password": "Admin1234!",
}

CATEGORIAS = [
    ("Hamburguesas", "Hamburguesas caseras con papas"),
    ("Pizzas", "Pizzas a la piedra"),
    ("Bebidas", "Bebidas frías"),
    ("Postres", "Postres de la casa"),
]

PRODUCTOS = [
    ("Hamburguesas", "Hamburguesa clásica", "Carne, lechuga, tomate y queso", 6500, 20, "photo-1568901346375-23c9450c58cd"),
    ("Hamburguesas", "Hamburguesa doble cheddar", "Doble carne, cheddar y panceta", 8900, 15, "photo-1553979459-d2229ba7433b"),
    ("Hamburguesas", "Hamburguesa veggie", "Medallón de lentejas y vegetales", 6200, 10, "photo-1520072959219-c595dc870360"),
    ("Pizzas", "Pizza muzzarella", "Salsa de tomate, muzzarella y aceitunas", 7800, 12, "photo-1513104890138-7c749659a591"),
    ("Pizzas", "Pizza napolitana", "Muzzarella, tomate en rodajas y ajo", 8600, 10, "photo-1574071318508-1cdbab80d002"),
    ("Pizzas", "Pizza fugazzeta", "Muzzarella y cebolla", 8300, 8, "photo-1565299624946-b28f40a0ae38"),
    ("Bebidas", "Gaseosa 500 ml", "Línea cola", 1800, 40, "photo-1622483767028-3f66f32aef97"),
    ("Bebidas", "Agua mineral 500 ml", "Sin gas", 1300, 40, "photo-1548839140-29a749e1cf4d"),
    ("Bebidas", "Limonada", "Limonada con menta y jengibre", 2500, 25, "photo-1621263764928-df1444c5e859"),
    ("Postres", "Flan casero", "Con dulce de leche", 3200, 15, "photo-1528975604071-b4dc52a2d18c"),
    ("Postres", "Brownie con helado", "Brownie tibio con helado de crema", 4200, 12, "photo-1564355808539-22fda35bed7e"),
]


def imagen(foto: str) -> str:
    return f"https://images.unsplash.com/{foto}?w=600&q=80"


def run() -> None:
    create_all_tables()
    with Session(engine) as session:
        if session.exec(select(Usuario).where(Usuario.username == ADMIN["username"])).first():
            print("El usuario admin ya existe")
        else:
            session.add(
                Usuario(
                    username=ADMIN["username"],
                    full_name=ADMIN["full_name"],
                    email=ADMIN["email"],
                    hashed_password=hash_password(ADMIN["password"]),
                    role="admin",
                )
            )
            print("Usuario creado: admin / Admin1234!")

        categorias: dict[str, Categoria] = {}
        for nombre, descripcion in CATEGORIAS:
            categoria = session.exec(select(Categoria).where(Categoria.nombre == nombre)).first()
            if categoria is None:
                categoria = Categoria(nombre=nombre, descripcion=descripcion)
                session.add(categoria)
                session.flush()
                print(f"Categoría creada: {nombre}")
            categorias[nombre] = categoria

        for categoria, nombre, descripcion, precio, stock, foto in PRODUCTOS:
            if session.exec(select(Producto).where(Producto.nombre == nombre)).first():
                continue
            session.add(
                Producto(
                    categoria_id=categorias[categoria].id,
                    nombre=nombre,
                    descripcion=descripcion,
                    precio_base=precio,
                    stock=stock,
                    imagen_url=imagen(foto),
                )
            )
            print(f"Producto creado: {nombre}")

        session.commit()
    print("Seed completo")


if __name__ == "__main__":
    run()
