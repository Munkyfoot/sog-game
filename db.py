import os
import sys
from sqlalchemy import Table, Column, ForeignKey, Integer, String, Boolean, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

#Enter name of database
db_name = "db"

'''
class Table(Base):
    __tablename__ = 'table'
    
    name = Column(String(80), nullable = False)
    id = Column(Integer, primary_key = True)

    @property
    def serialize(self):
        #Returns objects data in easily serializable format
        return{
            'name' : self.name,
            'id' : self.id
        }
'''

engine = create_engine('sqlite:///{}.db'.format(db_name))
Base.metadata.create_all(engine)