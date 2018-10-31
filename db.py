import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine

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