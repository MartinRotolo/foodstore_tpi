from collections.abc import Callable

from sqlmodel import Session

from app.core.database import session_factory


class UnitOfWork:
    def __init__(self, factory: Callable[[], Session] = session_factory):
        self._factory = factory
        self.session: Session

    def __enter__(self):
        self.session = self._factory()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type is None:
                self.session.commit()
            else:
                self.session.rollback()
        finally:
            self.session.close()
