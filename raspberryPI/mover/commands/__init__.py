""" Module for all commands """
from .ICommand import ICommand
from .motorMiddle import motorMiddle
from .motorLeft import motorLeft
from .motorRight import motorRight
from .moveServoAlpha import moveServoAlpha
from .moveServoGamma import moveServoGamma
from .startVideo import startVideo
from .stopVideo import stopVideo
#from os.path import dirname, basename, isfile
#import glob
#modules = glob.glob(dirname(__file__)+"/*.py")
#__all__ = [ basename(f)[:-3] for f in modules if isfile(f)]
