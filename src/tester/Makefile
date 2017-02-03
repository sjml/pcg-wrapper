
LDFLAGS  += -L../pcg-c/src
LDLIBS   += -lpcg_random
CFLAGS   += -O3
CFLAGS   += -std=c99

libpcg: ../pcg-c/src/libpcg_random.a
	cd ../pcg-c/src && make

pcg-tester.o: pcg-tester.c
pcg-tester: pcg-tester.o ../pcg-c/src/libpcg_random.a
