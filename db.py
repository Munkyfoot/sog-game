import os
import sys
from sqlalchemy import Table, Column, ForeignKey, Integer, String, Boolean, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

#Enter name of database
db_name = "game"

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

class Tile(Base):
    __tablename__ = 'tile'    
    
    id = Column(Integer, primary_key = True)
    color_id = Column(Integer, nullable = False)

    @property
    def serialize(self):
        #Returns objects data in easily serializable format
        return{
            'color_id' : self.color_id,
            'id' : self.id
        }


class Log(Base):
    __tablename__ = 'log'    
    
    id = Column(Integer, primary_key = True)
    ip_address = Column(String(32), nullable = False)
    date_time = Column(String(32), nullable = False)
    tile_id = Column(Integer, nullable = False)
    new_color_id = Column(Integer, nullable = False)

    @property
    def serialize(self):
        #Returns objects data in easily serializable format
        return{
            'id' : self.id,
            'ip_address' : self.ip_address,
            'date_time' : self.date_time,
            'tile_id' : self.tile_id,
            'new_color_id' : self.new_color_id
        }


class Message(Base):
    __tablename__ = 'message'    
    
    id = Column(Integer, primary_key = True)
    ip_address = Column(String(32), nullable = False)
    date_time = Column(String(32), nullable = False)
    name = Column(String(16), nullable = False)
    content = Column(String(200), nullable = False)

    @property
    def serialize(self):
        #Returns objects data in easily serializable format
        return{
            'id' : self.id,
            'ip_address' : self.ip_address,
            'date_time' : self.date_time,
            'name' : self.name,
            'content' : self.content
        }


engine = create_engine('sqlite:///{}.db'.format(db_name))
Base.metadata.create_all(engine)